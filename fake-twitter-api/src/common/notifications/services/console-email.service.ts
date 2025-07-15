/**
 * Console Email Service - Hardcoded implementation for development
 * Strategy Pattern: ConcreteStrategy
 */

import { Injectable } from '@nestjs/common';
import { EmailData, IEmailService } from '../interfaces/notification.interface';

@Injectable()
export class ConsoleEmailService implements IEmailService {
  async sendEmail(emailData: EmailData): Promise<boolean> {
    console.log('='.repeat(60));
    console.log('📧 EMAIL NOTIFICATION (CONSOLE)');
    console.log('='.repeat(60));
    console.log(`To: ${emailData.to}`);
    console.log(`From: ${emailData.from || 'noreply@fake-twitter.com'}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log('');
    console.log(emailData.body);
    console.log('='.repeat(60));

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    return true;
  }

  async send(data: EmailData): Promise<boolean> {
    return this.sendEmail(data);
  }
}
