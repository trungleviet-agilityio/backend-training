/**
 * Notification Factory - Factory Pattern
 * Creates appropriate notification services based on environment/config
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IEmailService,
  ISmsService,
} from '../interfaces/notification.interface';
import { ConsoleEmailService } from '../services/console-email.service';
import { RealEmailService } from '../services/real-email.service';

/**
 * Notification Provider - Enum for the notification provider.
 */
export enum NotificationProvider {
  CONSOLE = 'console',
  SENDGRID = 'sendgrid',
  AWS_SES = 'aws_ses',
  NODEMAILER = 'nodemailer',
}

@Injectable()
export class NotificationFactory {
  constructor(private configService: ConfigService) {}

  createEmailService(): IEmailService {
    const provider = this.configService.get<string>(
      'EMAIL_PROVIDER',
      NotificationProvider.CONSOLE,
    );

    switch (provider) {
      case NotificationProvider.CONSOLE:
        return new ConsoleEmailService();

      case NotificationProvider.SENDGRID:
      case NotificationProvider.AWS_SES:
      case NotificationProvider.NODEMAILER:
        // For now, return real service (which falls back to console)
        return new RealEmailService();

      default:
        console.warn(
          `Unknown email provider: ${provider}, falling back to console`,
        );
        return new ConsoleEmailService();
    }
  }

  // Future: Create SMS, Push notification services
  createSmsService(): ISmsService {
    // TODO: Implement SMS factory logic
    throw new Error('SMS service not implemented yet');
  }
}
