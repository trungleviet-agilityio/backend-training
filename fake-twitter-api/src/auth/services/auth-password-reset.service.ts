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
import {
  ForgotPasswordPayloadDto,
  ForgotPasswordResponseDto,
} from '../dto/forgot-password.dto';
import {
  ResetPasswordPayloadDto,
  ResetPasswordResponseDto,
} from '../dto/reset-password.dto';

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

  async forgotPassword(
    forgotPasswordPayloadDto: ForgotPasswordPayloadDto,
  ): Promise<ForgotPasswordResponseDto> {
    /**
     * Forgot password
     *
     * @param email - User email
     * @returns Message
     */
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordPayloadDto.email },
    });
    if (!user) {
      // Don't reveal if user exists or not
      return new ForgotPasswordResponseDto();
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

    this.logger.log('Forgot password email sent', user.email);

    return new ForgotPasswordResponseDto();
  }

  async resetPassword(
    resetPasswordPayloadDto: ResetPasswordPayloadDto,
  ): Promise<ResetPasswordResponseDto> {
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
      const isValidToken = await bcrypt.compare(
        resetPasswordPayloadDto.token,
        reset.tokenHash,
      );
      if (isValidToken) {
        validPasswordReset = reset;
        break;
      }
    }

    if (!validPasswordReset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const newPasswordHash = await bcrypt.hash(
      resetPasswordPayloadDto.password,
      12,
    );
    await this.userRepository.update(validPasswordReset.userUuid, {
      passwordHash: newPasswordHash,
    });

    await this.authPasswordResetRepository.update(validPasswordReset.uuid, {
      isUsed: true,
    });

    this.logger.log('Password reset successfully');

    return new ResetPasswordResponseDto();
  }
}
