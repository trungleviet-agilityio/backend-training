/**
 * Main Notification Service - Facade Pattern
 * Provides simple interface for all notification operations
 */

import { Injectable } from '@nestjs/common';
import { NotificationFactory } from '../factories';
import {
  PasswordResetEmailBuilder,
  PasswordResetSuccessEmailBuilder,
} from '../templates/email-template.builder';

/**
 * Notification Service - Facade Pattern
 * Provides simple interface for all notification operations
 */
@Injectable()
export class NotificationService {
  constructor(private notificationFactory: NotificationFactory) {}

  async sendPasswordResetEmail(
    email: string,
    token: string,
    userName?: string,
  ): Promise<boolean> {
    const emailService = this.notificationFactory.createEmailService();
    const emailBuilder = new PasswordResetEmailBuilder();

    const emailData = emailBuilder.buildEmail({ email, token, userName });
    return emailService.sendEmail(emailData);
  }

  async sendPasswordResetSuccessEmail(
    email: string,
    userName?: string,
  ): Promise<boolean> {
    const emailService = this.notificationFactory.createEmailService();
    const emailBuilder = new PasswordResetSuccessEmailBuilder();

    const emailData = emailBuilder.buildEmail({ email, userName });
    return emailService.sendEmail(emailData);
  }

  // Future: Add more notification methods
  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    // TODO: Implement welcome email
    console.log(`Welcome email would be sent to ${email}`);
    return true;
  }
}
