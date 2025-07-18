/**
 * AuthPasswordResetService Unit Tests
 * This file contains unit tests for the AuthPasswordResetService class.
 * It tests the forgotPassword and resetPassword methods.
 *
 * Test Coverage:
 * - forgotPassword - Sends password reset email when user exists
 * - forgotPassword - Returns success message when user does not exist
 * - resetPassword - Resets password successfully with valid token
 * - resetPassword - Throws UnauthorizedException for invalid token
 * - resetPassword - Throws UnauthorizedException for expired token
 * This will cover the missing 29.72% of auth module coverage
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthPasswordResetService } from '../services/auth-password-reset.service';
import { User } from '../../database/entities/user.entity';
import { AuthPasswordReset } from '../../database/entities/auth-password-reset.entity';
import { NotificationService } from '../../notifications/services/notification.service';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthMockProvider } from './mocks/auth-mock.provider';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthPasswordResetService', () => {
  let service: AuthPasswordResetService;
  let userRepository: jest.Mocked<Repository<User>>;
  let authPasswordResetRepository: jest.Mocked<Repository<AuthPasswordReset>>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(async () => {
    const mockUserRepository = AuthMockProvider.createUserRepository();
    const mockAuthPasswordResetRepository =
      AuthMockProvider.createAuthPasswordResetRepository();
    const mockNotificationService =
      AuthMockProvider.createNotificationService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPasswordResetService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(AuthPasswordReset),
          useValue: mockAuthPasswordResetRepository,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = moduleRef.get<AuthPasswordResetService>(AuthPasswordResetService);
    userRepository = moduleRef.get(getRepositoryToken(User));
    authPasswordResetRepository = moduleRef.get(
      getRepositoryToken(AuthPasswordReset),
    );
    notificationService = moduleRef.get(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('forgotPassword', () => {
    it('should send password reset email when user exists', async () => {
      // Arrange
      const email = 'test@example.com';
      const user = TestDataFactory.createUser({ email });
      const resetToken =
        '4a8ae0cc48145d2acfb1b1681124447ac17704badbfb364b38a567f99d515b8d';
      const resetTokenHash = 'hashed-reset-token';

      const mockRandomBytes = jest.spyOn(require('crypto'), 'randomBytes');
      mockRandomBytes.mockReturnValue(Buffer.from(resetToken, 'hex'));

      userRepository.findOne.mockResolvedValue(user);
      mockedBcrypt.hash.mockResolvedValue(resetTokenHash as never);
      authPasswordResetRepository.create.mockReturnValue({
        userUuid: user.uuid,
        tokenHash: resetTokenHash,
        expiresAt: expect.any(Date),
      } as AuthPasswordReset);
      authPasswordResetRepository.save.mockResolvedValue({
        uuid: 'reset-uuid',
        userUuid: user.uuid,
        tokenHash: resetTokenHash,
        expiresAt: new Date(),
        isUsed: false,
      } as AuthPasswordReset);
      notificationService.sendPasswordResetEmail.mockResolvedValue(true);

      // Act
      const result = await service.forgotPassword(email);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(resetToken, 12);
      expect(authPasswordResetRepository.create).toHaveBeenCalled();
      expect(authPasswordResetRepository.save).toHaveBeenCalled();
      expect(notificationService.sendPasswordResetEmail).toHaveBeenCalledWith(
        user.email,
        resetToken,
      );
      expect(result).toEqual({
        message: 'If the email exists, a reset link has been sent',
      });

      mockRandomBytes.mockRestore();
    });

    it('should return success message when user does not exist', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      userRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.forgotPassword(email);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual({
        message: 'If the email exists, a reset link has been sent',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully with valid token', async () => {
      // Arrange
      const token = 'valid-reset-token';
      const newPassword = 'NewSecurePass123!';
      const user = TestDataFactory.createUser();
      const passwordReset = TestDataFactory.createPasswordReset({
        userUuid: user.uuid,
        isUsed: false,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });

      authPasswordResetRepository.find.mockResolvedValue([passwordReset]);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('new-hashed-password' as never);
      userRepository.update.mockResolvedValue({ affected: 1 } as any);
      authPasswordResetRepository.update.mockResolvedValue({
        affected: 1,
      } as any);

      // Act
      const result = await service.resetPassword(token, newPassword);

      // Assert
      expect(authPasswordResetRepository.find).toHaveBeenCalledWith({
        where: {
          expiresAt: expect.any(Object),
          isUsed: false,
        },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        token,
        passwordReset.tokenHash,
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(userRepository.update).toHaveBeenCalledWith(user.uuid, {
        passwordHash: 'new-hashed-password',
      });
      expect(authPasswordResetRepository.update).toHaveBeenCalledWith(
        passwordReset.uuid,
        {
          isUsed: true,
        },
      );
      expect(result).toEqual({ message: 'Password reset successfully' });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const token = 'invalid-reset-token';
      const newPassword = 'NewSecurePass123!';
      const passwordReset = TestDataFactory.createPasswordReset({
        isUsed: false,
        expiresAt: new Date(Date.now() + 3600000),
      });

      authPasswordResetRepository.find.mockResolvedValue([passwordReset]);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired token', async () => {
      // Arrange
      const token = 'expired-reset-token';
      const newPassword = 'NewSecurePass123!';
      const expiredPasswordReset = TestDataFactory.createPasswordReset({
        isUsed: false,
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      });

      authPasswordResetRepository.find.mockResolvedValue([
        expiredPasswordReset,
      ]);

      // Act & Assert
      await expect(service.resetPassword(token, newPassword)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
