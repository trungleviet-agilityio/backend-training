/**
 * Password Management Service - Handles password operations
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { AuthPasswordReset } from '../../database/entities/auth-password-reset.entity';
import { NotificationService } from '../../notifications/services';
import { AuthUserService } from './auth-user.service';

@Injectable()
export class AuthPasswordService {
  constructor(
    @InjectRepository(AuthPasswordReset)
    private readonly resetRepository: Repository<AuthPasswordReset>,
    private readonly userService: AuthUserService,
    private readonly notificationService: NotificationService,
  ) {}

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 12);

    // Save reset token
    const passwordReset = this.resetRepository.create({
      userUuid: user.uuid,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    });
    await this.resetRepository.save(passwordReset);

    // Send notification
    await this.notificationService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find valid reset tokens
    const resets = await this.resetRepository.find({
      where: {
        expiresAt: MoreThan(new Date()),
        isUsed: false,
      },
    });

    // Find matching token
    let validReset: AuthPasswordReset | null = null;
    for (const reset of resets) {
      const isValid = await bcrypt.compare(token, reset.tokenHash);
      if (isValid) {
        validReset = reset;
        break;
      }
    }

    if (!validReset) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Update password and mark token as used
    await this.userService.updatePassword(validReset.userUuid, newPassword);
    await this.resetRepository.update(validReset.uuid, { isUsed: true });
  }
}
