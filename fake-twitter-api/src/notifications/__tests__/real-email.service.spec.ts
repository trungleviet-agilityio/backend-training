/**
 * This file contains the tests for the real email service.
 */

import { RealEmailService } from '../services/real-email.service';
import { EmailData } from '../interfaces/notification.interface';

describe('RealEmailService', () => {
  let service: RealEmailService;

  beforeEach(() => {
    service = new RealEmailService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log not implemented and fallback to ConsoleEmailService', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const emailData: EmailData = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Hello',
    };
    const result = await service.sendEmail(emailData);
    expect(result).toBe(true);
    expect(logSpy).toHaveBeenCalledWith(
      'REAL EMAIL SERVICE - Not implemented yet',
    );
    logSpy.mockRestore();
  });

  it('should delegate send to sendEmail', async () => {
    const spy = jest.spyOn(service, 'sendEmail').mockResolvedValue(true);
    const emailData: EmailData = {
      to: 'test@example.com',
      subject: 'Test',
      body: 'Hello',
    };
    const result = await service.send(emailData);
    expect(spy).toHaveBeenCalledWith(emailData);
    expect(result).toBe(true);
    spy.mockRestore();
  });
});
