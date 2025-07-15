/**
 * Real Email Service - For production use
 * Strategy Pattern: ConcreteStrategy
 */

import { Injectable } from '@nestjs/common';
import { EmailData, IEmailService } from '../interfaces/notification.interface';

/**
 * Real Email Service - For production use
 * Strategy Pattern: ConcreteStrategy
 */
@Injectable()
export class RealEmailService implements IEmailService {
  /**
   * Send an email
   * @param emailData - The email data
   * @returns A promise that resolves to a boolean indicating success
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    // TODO: Implement with real email service (SendGrid, AWS SES, etc.)
    console.log('REAL EMAIL SERVICE - Not implemented yet');

    // For now, fall back to console
    const consoleService = new (
      await import('./console-email.service')
    ).ConsoleEmailService();
    return consoleService.sendEmail(emailData);
  }

  async send(data: EmailData): Promise<boolean> {
    return this.sendEmail(data);
  }
}
