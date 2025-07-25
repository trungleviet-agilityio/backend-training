/**
 * Auth Service Tests - Testing the main orchestrator
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthErrorHandler,
  AuthPasswordService,
  AuthService,
  AuthSessionService,
  AuthTokenService,
  AuthUserService,
} from '../services';
import { TestDataFactory } from '../../common/__tests__/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<AuthUserService>;
  let tokenService: jest.Mocked<AuthTokenService>;
  let passwordService: jest.Mocked<AuthPasswordService>;
  let sessionService: jest.Mocked<AuthSessionService>;
  let errorHandler: jest.Mocked<AuthErrorHandler>;

  beforeEach(async () => {
    const mockUserService = {
      validateCredentials: jest.fn(),
      createUser: jest.fn(),
    };

    const mockTokenService = {
      generateTokens: jest.fn(),
      validateRefreshToken: jest.fn(),
    };

    const mockPasswordService = {
      initiatePasswordReset: jest.fn(),
      resetPassword: jest.fn(),
    };

    const mockSessionService = {
      invalidateSession: jest.fn(),
    };

    const mockErrorHandler = {
      handleLoginError: jest.fn().mockImplementation(error => {
        throw error;
      }),
      handleRegistrationError: jest.fn().mockImplementation(error => {
        throw error;
      }),
      handleRefreshError: jest.fn().mockImplementation(error => {
        throw error;
      }),
      handleLogoutError: jest.fn().mockImplementation(error => {
        throw error;
      }),
      handlePasswordResetError: jest.fn().mockImplementation(error => {
        throw error;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthUserService, useValue: mockUserService },
        { provide: AuthTokenService, useValue: mockTokenService },
        { provide: AuthPasswordService, useValue: mockPasswordService },
        { provide: AuthSessionService, useValue: mockSessionService },
        { provide: AuthErrorHandler, useValue: mockErrorHandler },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(AuthUserService);
    tokenService = module.get(AuthTokenService);
    passwordService = module.get(AuthPasswordService);
    sessionService = module.get(AuthSessionService);
    errorHandler = module.get(AuthErrorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should orchestrate login successfully', async () => {
      // Arrange
      const loginPayload = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = TestDataFactory.createUser();
      const mockTokens = TestDataFactory.createAuthTokens();

      userService.validateCredentials.mockResolvedValue(mockUser);
      tokenService.generateTokens.mockResolvedValue(mockTokens);

      // Act
      const result = await service.login(loginPayload);

      // Assert
      expect(userService.validateCredentials).toHaveBeenCalledWith(
        loginPayload.email,
        loginPayload.password,
      );
      expect(tokenService.generateTokens).toHaveBeenCalledWith(mockUser);
      expect(result).toHaveProperty('data.tokens');
      expect(result).toHaveProperty('data.user');
    });

    it('should handle login errors', async () => {
      // Arrange
      const loginPayload = { email: 'test@example.com', password: 'wrong' };
      const error = new Error('Invalid credentials');

      userService.validateCredentials.mockRejectedValue(error);

      // Act & Assert
      await expect(service.login(loginPayload)).rejects.toThrow();
      expect(errorHandler.handleLoginError).toHaveBeenCalledWith(error);
    });
  });

  describe('register', () => {
    it('should orchestrate registration successfully', async () => {
      // Arrange
      const registerPayload = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };
      const mockUser = TestDataFactory.createUser();
      const mockTokens = TestDataFactory.createAuthTokens();

      userService.createUser.mockResolvedValue(mockUser);
      tokenService.generateTokens.mockResolvedValue(mockTokens);

      // Act
      const result = await service.register(registerPayload);

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(registerPayload);
      expect(tokenService.generateTokens).toHaveBeenCalledWith(mockUser);
      expect(result).toHaveProperty('data.tokens');
      expect(result).toHaveProperty('data.user');
    });
  });

  describe('refresh', () => {
    it('should orchestrate token refresh successfully', async () => {
      // Arrange
      const refreshPayload = { refreshToken: 'valid-refresh-token' };
      const mockUser = TestDataFactory.createUser();
      const sessionId = 'session-id';
      const mockTokens = TestDataFactory.createAuthTokens();

      tokenService.validateRefreshToken.mockResolvedValue({
        user: mockUser,
        sessionId,
      });
      tokenService.generateTokens.mockResolvedValue(mockTokens);

      // Act
      const result = await service.refresh(refreshPayload);

      // Assert
      expect(tokenService.validateRefreshToken).toHaveBeenCalledWith(
        refreshPayload.refreshToken,
      );
      expect(tokenService.generateTokens).toHaveBeenCalledWith(
        mockUser,
        sessionId,
      );
      expect(result).toHaveProperty('data');
    });
  });

  describe('logout', () => {
    it('should orchestrate logout successfully', async () => {
      // Arrange
      const user = {
        sessionId: 'session-id',
        email: 'test@example.com',
      } as any;

      sessionService.invalidateSession.mockResolvedValue();

      // Act
      const result = await service.logout(user);

      // Assert
      expect(sessionService.invalidateSession).toHaveBeenCalledWith(
        user.sessionId,
      );
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('forgotPassword', () => {
    it('should orchestrate forgot password successfully', async () => {
      // Arrange
      const forgotPayload = { email: 'test@example.com' };

      passwordService.initiatePasswordReset.mockResolvedValue();

      // Act
      const result = await service.forgotPassword(forgotPayload);

      // Assert
      expect(passwordService.initiatePasswordReset).toHaveBeenCalledWith(
        forgotPayload.email,
      );
      expect(result).toHaveProperty('success', true);
    });

    it('should always return success even on error (security)', async () => {
      // Arrange
      const forgotPayload = { email: 'test@example.com' };

      passwordService.initiatePasswordReset.mockRejectedValue(
        new Error('User not found'),
      );

      // Act
      const result = await service.forgotPassword(forgotPayload);

      // Assert
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('resetPassword', () => {
    it('should orchestrate password reset successfully', async () => {
      // Arrange
      const resetPayload = { token: 'valid-token', password: 'newpassword123' };

      passwordService.resetPassword.mockResolvedValue();

      // Act
      const result = await service.resetPassword(resetPayload);

      // Assert
      expect(passwordService.resetPassword).toHaveBeenCalledWith(
        resetPayload.token,
        resetPayload.password,
      );
      expect(result).toHaveProperty('success', true);
    });
  });
});
