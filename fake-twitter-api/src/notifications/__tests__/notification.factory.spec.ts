/**
 * This file contains the tests for the notification factory.
 */

import {
  NotificationFactory,
  NotificationProvider,
} from '../factories/notification.factory';
import { ConfigService } from '@nestjs/config';
import { ConsoleEmailService } from '../services/console-email.service';
import { RealEmailService } from '../services/real-email.service';

describe('NotificationFactory', () => {
  let factory: NotificationFactory;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as any;
    factory = new NotificationFactory(configService);
  });

  it('should return ConsoleEmailService for provider "console"', () => {
    configService.get.mockReturnValue(NotificationProvider.CONSOLE);
    const service = factory.createEmailService();
    expect(service).toBeInstanceOf(ConsoleEmailService);
  });

  it('should return RealEmailService for provider "sendgrid"', () => {
    configService.get.mockReturnValue(NotificationProvider.SENDGRID);
    const service = factory.createEmailService();
    expect(service).toBeInstanceOf(RealEmailService);
  });

  it('should fallback to ConsoleEmailService for unknown provider', () => {
    configService.get.mockReturnValue('unknown');
    const service = factory.createEmailService();
    expect(service).toBeInstanceOf(ConsoleEmailService);
  });

  it('should throw error for createSmsService', () => {
    expect(() => factory.createSmsService()).toThrow(
      'SMS service not implemented yet',
    );
  });
});
