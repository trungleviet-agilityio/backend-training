/**
 * AuthErrorHandler Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AuthErrorHandler } from '../services';
import { RegisterPayloadDto } from '../dto';

describe('AuthErrorHandler', () => {
  let errorHandler: AuthErrorHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthErrorHandler],
    }).compile();

    errorHandler = module.get<AuthErrorHandler>(AuthErrorHandler);
  });

  describe('handleLoginError', () => {
    it('should throw AuthInvalidCredentialsError for invalid credentials', () => {
      // Arrange
      const error = new Error('Invalid credentials');

      // Act & Assert
      expect(() => errorHandler.handleLoginError(error)).toThrow(
        UnauthorizedException,
      );
    });

    it('should re-throw original error for other errors', () => {
      // Arrange
      const error = new Error('Database connection failed');

      // Act & Assert
      expect(() => errorHandler.handleLoginError(error)).toThrow(
        'Database connection failed',
      );
    });
  });

  describe('handleRegistrationError', () => {
    const registerPayload: RegisterPayloadDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should throw ConflictException for email exists error', () => {
      // Arrange
      const error = new Error('EMAIL_EXISTS');

      // Act & Assert
      expect(() =>
        errorHandler.handleRegistrationError(error, registerPayload),
      ).toThrow(ConflictException);
    });

    it('should throw ConflictException for username exists error', () => {
      // Arrange
      const error = new Error('USERNAME_EXISTS');

      // Act & Assert
      expect(() =>
        errorHandler.handleRegistrationError(error, registerPayload),
      ).toThrow(ConflictException);
    });

    it('should throw UnprocessableEntityException for password error', () => {
      // Arrange
      const error = new Error('password validation failed');

      // Act & Assert
      expect(() =>
        errorHandler.handleRegistrationError(error, registerPayload),
      ).toThrow(UnprocessableEntityException);
    });
  });

  describe('handleRefreshError', () => {
    it('should throw AuthInvalidTokenError for refresh token errors', () => {
      // Arrange
      const error = new Error('Token expired');

      // Act & Assert
      expect(() => errorHandler.handleRefreshError(error)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('handlePasswordResetError', () => {
    it('should throw AuthPasswordResetTokenExpiredError for expired token', () => {
      // Arrange
      const error = new Error('Invalid or expired reset token');

      // Act & Assert
      expect(() => errorHandler.handlePasswordResetError(error)).toThrow(
        UnauthorizedException,
      );
    });

    it('should re-throw original error for other errors', () => {
      // Arrange
      const error = new Error('Database error');

      // Act & Assert
      expect(() => errorHandler.handlePasswordResetError(error)).toThrow(
        'Database error',
      );
    });
  });
});
