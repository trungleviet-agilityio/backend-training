/**
 * This file contains the tests for the console email service.
 */

import { ConsoleEmailService } from '../services/console-email.service';
import { EmailData } from '../interfaces/notification.interface';

describe('ConsoleEmailService', () => {
  let service: ConsoleEmailService;

  beforeEach(() => {
    service = new ConsoleEmailService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log email and return true (sendEmail)', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const emailData: EmailData = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Hello',
    };
    const result = await service.sendEmail(emailData);
    expect(result).toBe(true);
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should delegate send to sendEmail', async () => {
    const emailData: EmailData = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Hello',
    };
    const spy = jest.spyOn(service, 'sendEmail').mockResolvedValue(true);
    const result = await service.send(emailData);
    expect(spy).toHaveBeenCalledWith(emailData);
    expect(result).toBe(true);
    spy.mockRestore();
  });
});
