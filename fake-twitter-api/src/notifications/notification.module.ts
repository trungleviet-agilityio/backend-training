/**
 * Notification Module
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationFactory } from './factories/notification.factory';
import {
  ConsoleEmailService,
  NotificationService,
  RealEmailService,
} from './services';

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
