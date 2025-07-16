/**
 * Notification Module
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationFactory } from './factories/notification.factory';
import { ConsoleEmailService } from './services/console-email.service';
import { RealEmailService } from './services/real-email.service';

/**
 * Notification Module
 */
@Module({
  imports: [ConfigModule],
  providers: [
    NotificationService,
    NotificationFactory,
    ConsoleEmailService,
    RealEmailService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
