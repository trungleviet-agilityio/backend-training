/**
 * Auth password reset service
 */

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { User } from '../../database/entities/user.entity';
import { AuthPasswordReset } from '../../database/entities/auth-password-reset.entity';
import { NotificationService } from '../../notifications/services';

@Injectable()
export class AuthPasswordResetService {
  /**
   * Logger
   */
  private readonly logger = new Logger(AuthPasswordResetService.name);

  /**
   * Constructor
   *
   * @param userRepository - User repository
   * @param authPasswordResetRepository - Auth password reset repository
   * @param notificationService - Notification service
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(AuthPasswordReset)
    private readonly authPasswordResetRepository: Repository<AuthPasswordReset>,

    private readonly notificationService: NotificationService,
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    /**
     * Forgot password
     *
     * @param email - User email
     * @returns Message
     */
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if user exists or not
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 12);

    const passwordReset = this.authPasswordResetRepository.create({
      userUuid: user.uuid,
      tokenHash: resetTokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });

    await this.authPasswordResetRepository.save(passwordReset);

    // Send email notification
    await this.notificationService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    /**
     * Reset password
     *
     * @param token - Reset token
     * @param newPassword - New password
     * @returns Message
     */

    // Find all unused, non-expired reset tokens
    const passwordResets = await this.authPasswordResetRepository.find({
      where: {
        expiresAt: MoreThan(new Date()),
        isUsed: false,
      },
    });

    // Find the correct token by comparing with all available tokens
    let validPasswordReset: AuthPasswordReset | null = null;
    for (const reset of passwordResets) {
      const isValidToken = await bcrypt.compare(token, reset.tokenHash);
      if (isValidToken) {
        validPasswordReset = reset;
        break;
      }
    }

    if (!validPasswordReset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(validPasswordReset.userUuid, {
      passwordHash: newPasswordHash,
    });

    await this.authPasswordResetRepository.update(validPasswordReset.uuid, {
      isUsed: true,
    });

    return { message: 'Password reset successfully' };
  }
}
