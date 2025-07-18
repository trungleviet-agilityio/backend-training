/**
 * AuthService Unit Tests
 *
 * This test suite demonstrates comprehensive unit testing for the AuthService
 * using the Factory, Builder, and Strategy patterns.
 *
 * - Login functionality (success and failure scenarios)
 * - Registration functionality (success and failure scenarios)
 * - Token refresh functionality
 * - Logout functionality
 * - User validation functionality
 * - Password reset functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthOperationFactory } from '../factories/auth-operation.factory';
import { AuthPasswordResetService } from '../services/auth-password-reset.service';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthTestBuilder } from './mocks/auth-test.builder';
import { AuthMockProvider } from './mocks/auth-mock.provider';

describe('AuthService', () => {
  let service: AuthService;
  let authOperationFactory: jest.Mocked<AuthOperationFactory>;
  let authPasswordResetService: jest.Mocked<AuthPasswordResetService>;

  beforeEach(async () => {
    // Create mocks using the Mock Provider (Factory Pattern)
    const mockAuthOperationFactory =
      AuthMockProvider.createAuthOperationFactory();
    const mockAuthPasswordResetService =
      AuthMockProvider.createAuthPasswordResetService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthOperationFactory,
          useValue: mockAuthOperationFactory,
        },
        {
          provide: AuthPasswordResetService,
          useValue: mockAuthPasswordResetService,
        },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    authOperationFactory = moduleRef.get(AuthOperationFactory);
    authPasswordResetService = moduleRef.get(AuthPasswordResetService);
  });

  afterEach(() => {
    // Clean up all mocks after each test
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      // Arrange - Using Builder Pattern for complex scenario setup
      const scenario = new AuthTestBuilder()
        .withLoginDto(TestDataFactory.createLoginDto())
        .withTokens(TestDataFactory.createAuthTokens())
        .build();

      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.authenticate.mockResolvedValue(scenario.tokens!);

      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await service.login(scenario.loginDto!);

      // Assert
      expect(authOperationFactory.createStrategy).toHaveBeenCalled();
      expect(mockStrategy.authenticate).toHaveBeenCalledWith(scenario.loginDto);
      expect(result).toEqual(scenario.tokens);
    });

    it('should handle authentication failure with invalid credentials', async () => {
      // Arrange - Using Builder Pattern for error scenario
      const scenario = new AuthTestBuilder()
        .withLoginDto(
          TestDataFactory.createLoginDto({ email: 'invalid@example.com' }),
        )
        .withError(new UnauthorizedException('Invalid credentials'))
        .build();

      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.authenticate.mockRejectedValue(scenario.error);
      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(service.login(scenario.loginDto!)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockStrategy.authenticate).toHaveBeenCalledWith(scenario.loginDto);
    });
  });

  describe('register', () => {
    it('should register user successfully with valid data', async () => {
      // Arrange - Using Builder Pattern for registration scenario
      const scenario = new AuthTestBuilder()
        .withRegisterDto(TestDataFactory.createRegisterDto())
        .withTokens(
          TestDataFactory.createAuthTokens({
            user: {
              uuid: 'new-user-uuid',
              username: 'newuser',
              firstName: 'New',
              lastName: 'User',
              role: { name: 'user' },
            },
          }),
        )
        .build();

      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.register.mockResolvedValue(scenario.tokens!);

      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await service.register(scenario.registerDto!);

      // Assert
      expect(authOperationFactory.createStrategy).toHaveBeenCalled();
      expect(mockStrategy.register).toHaveBeenCalledWith(scenario.registerDto);
      expect(result).toEqual(scenario.tokens);
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const expectedTokens = TestDataFactory.createRefreshTokenResponse();

      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.refreshToken.mockResolvedValue(expectedTokens);

      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await service.refresh(refreshToken);

      // Assert
      expect(authOperationFactory.createStrategy).toHaveBeenCalled();
      expect(mockStrategy.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(expectedTokens);
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const sessionId = 'test-session-id';
      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.logout.mockResolvedValue(undefined);

      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      await service.logout(sessionId);

      // Assert
      expect(authOperationFactory.createStrategy).toHaveBeenCalled();
      expect(mockStrategy.logout).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('validateUser', () => {
    it('should validate user successfully with valid token', async () => {
      // Arrange
      const token = 'valid-token';
      const expectedUser = TestDataFactory.createUser();

      const mockStrategy = AuthMockProvider.createAuthStrategy();
      mockStrategy.validateToken.mockResolvedValue(expectedUser);

      authOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await service.validateUser(token);

      // Assert
      expect(authOperationFactory.createStrategy).toHaveBeenCalled();
      expect(mockStrategy.validateToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      const expectedMessage = {
        message: 'If the email exists, a reset link has been sent',
      };

      // Mock notification service
      const mockNotificationService =
        AuthMockProvider.createNotificationService();
      mockNotificationService.sendPasswordResetEmail.mockResolvedValue(true);

      authPasswordResetService.forgotPassword.mockResolvedValue(
        expectedMessage,
      );

      // Act
      const result = await service.forgotPassword(email);

      // Assert
      expect(authPasswordResetService.forgotPassword).toHaveBeenCalledWith(
        email,
      );
      expect(result).toEqual(expectedMessage);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully with valid token', async () => {
      // Arrange
      const token = 'valid-reset-token';
      const newPassword = 'NewSecurePass123!';
      const expectedMessage = { message: 'Password reset successfully' };

      authPasswordResetService.resetPassword.mockResolvedValue(expectedMessage);

      // Act
      const result = await service.resetPassword(token, newPassword);

      // Assert
      expect(authPasswordResetService.resetPassword).toHaveBeenCalledWith(
        token,
        newPassword,
      );
      expect(result).toEqual(expectedMessage);
    });
  });
});
