import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../services/notification.service';
import { NotificationFactory } from '../factories/notification.factory';
import { IEmailService } from '../interfaces/notification.interface';

// Mock the email builders
jest.mock('../templates/email-template.builder', () => ({
  PasswordResetEmailBuilder: jest.fn().mockImplementation(() => ({
    buildEmail: jest.fn().mockReturnValue({
      to: 'test@example.com',
      subject: 'Reset',
      body: 'body',
    }),
  })),
  PasswordResetSuccessEmailBuilder: jest.fn().mockImplementation(() => ({
    buildEmail: jest.fn().mockReturnValue({
      to: 'test@example.com',
      subject: 'Success',
      body: 'body',
    }),
  })),
}));

describe('NotificationService', () => {
  let service: NotificationService;
  let factory: NotificationFactory;
  let emailService: jest.Mocked<IEmailService>;

  beforeEach(async () => {
    emailService = {
      sendEmail: jest.fn().mockResolvedValue(true),
      send: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationFactory,
          useValue: {
            createEmailService: jest.fn(() => emailService),
          },
        },
      ],
    }).compile();

    service = module.get(NotificationService);
    factory = module.get(NotificationFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email and return true', async () => {
      const result = await service.sendPasswordResetEmail(
        'test@example.com',
        'token',
        'TestUser',
      );
      expect(factory.createEmailService).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'test@example.com', subject: 'Reset' }),
      );
      expect(result).toBe(true);
    });
  });

  describe('sendPasswordResetSuccessEmail', () => {
    it('should send password reset success email and return true', async () => {
      const result = await service.sendPasswordResetSuccessEmail(
        'test@example.com',
        'TestUser',
      );
      expect(factory.createEmailService).toHaveBeenCalled();
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'test@example.com', subject: 'Success' }),
      );
      expect(result).toBe(true);
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should log and return true', async () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = await service.sendWelcomeEmail(
        'test@example.com',
        'TestUser',
      );
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Welcome email would be sent to test@example.com',
        ),
      );
      expect(result).toBe(true);
      logSpy.mockRestore();
    });
  });
});
