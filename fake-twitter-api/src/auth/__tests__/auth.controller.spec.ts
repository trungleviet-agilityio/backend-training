// src/auth/__tests__/auth.controller.spec.ts
/**
 * AuthController Unit Tests
 *
 * This test suite demonstrates comprehensive unit testing for the AuthController
 * using the Factory, Builder, and Strategy patterns.
 *
 * Test Coverage:
 * - POST /auth/register - User registration endpoint
 * - POST /auth/login - User login endpoint
 * - POST /auth/refresh - Token refresh endpoint
 * - POST /auth/logout - User logout endpoint
 * - POST /auth/forgot-password - Password reset request endpoint
 * - POST /auth/reset-password - Password reset endpoint
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthTestBuilder } from './mocks/auth-test.builder';
import { AuthMockProvider } from './mocks/auth-mock.provider';
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from '../dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    // Create mocks using the Mock Provider (Factory Pattern)
    const mockAuthService = AuthMockProvider.createAuthService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get(AuthService);
  });

  afterEach(() => {
    // Clean up all mocks after each test
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
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

      authService.register.mockResolvedValue(scenario.tokens!);

      // Act
      const result = await controller.register(scenario.registerDto!);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(scenario.registerDto);
      expect(result).toEqual(scenario.tokens);
    });

    it('should handle registration validation errors', async () => {
      // Arrange
      const invalidRegisterDto = TestDataFactory.createRegisterDto({
        email: 'invalid-email',
        password: '123', // too short
      });

      authService.register.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(controller.register(invalidRegisterDto)).rejects.toThrow(
        'Validation failed',
      );
    });

    it('should handle registration failure when user already exists', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterDto({
        email: 'existing@example.com',
      });

      authService.register.mockRejectedValue(
        new UnauthorizedException('User already exists'),
      );

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should handle registration failure with missing required fields', async () => {
      // Arrange
      const incompleteRegisterDto = {
        email: 'test@example.com',
        // missing username and password
      } as RegisterDto;

      authService.register.mockRejectedValue(
        new BadRequestException('Missing required fields'),
      );

      // Act & Assert
      await expect(controller.register(incompleteRegisterDto)).rejects.toThrow(
        'Missing required fields',
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const scenario = new AuthTestBuilder()
        .withLoginDto(TestDataFactory.createLoginDto())
        .withTokens(TestDataFactory.createAuthTokens())
        .build();

      authService.login.mockResolvedValue(scenario.tokens!);

      // Act
      const result = await controller.login(scenario.loginDto!);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(scenario.loginDto);
      expect(result).toEqual(scenario.tokens);
    });

    it('should handle login failure with invalid credentials', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

      authService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should handle login failure with inactive user', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto();

      authService.login.mockRejectedValue(
        new UnauthorizedException('User is inactive'),
      );

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        'User is inactive',
      );
    });

    it('should handle login failure with missing credentials', async () => {
      // Arrange
      const incompleteLoginDto = {
        email: 'test@example.com',
        // missing password
      } as LoginDto;

      authService.login.mockRejectedValue(
        new BadRequestException('Password is required'),
      );

      // Act & Assert
      await expect(controller.login(incompleteLoginDto)).rejects.toThrow(
        'Password is required',
      );
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token',
      };
      const expectedTokens = TestDataFactory.createRefreshTokenResponse();

      authService.refresh.mockResolvedValue(expectedTokens);

      // Act
      const result = await controller.refresh(refreshTokenDto);

      // Assert
      expect(authService.refresh).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(result).toEqual(expectedTokens);
    });

    it('should handle refresh failure with invalid refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'invalid-refresh-token',
      };

      authService.refresh.mockRejectedValue(
        new UnauthorizedException('Invalid refresh token'),
      );

      // Act & Assert
      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should handle refresh failure with expired refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'expired-refresh-token',
      };

      authService.refresh.mockRejectedValue(
        new UnauthorizedException('Token expired'),
      );

      // Act & Assert
      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(
        'Token expired',
      );
    });

    it('should handle refresh failure with missing refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: '',
      };

      authService.refresh.mockRejectedValue(
        new BadRequestException('Refresh token is required'),
      );

      // Act & Assert
      await expect(controller.refresh(refreshTokenDto)).rejects.toThrow(
        'Refresh token is required',
      );
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const user: JwtPayload = {
        sub: 'test-user-uuid',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        permissions: {},
        sessionId: 'test-session-id',
      };

      authService.logout.mockResolvedValue(undefined);

      // Act
      await controller.logout(user);

      // Assert
      expect(authService.logout).toHaveBeenCalledWith(user.sub);
    });

    it('should handle logout failure', async () => {
      // Arrange
      const user: JwtPayload = {
        sub: 'invalid-user-uuid',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        permissions: {},
        sessionId: 'invalid-session-id',
      };

      authService.logout.mockRejectedValue(new Error('Session not found'));

      // Act & Assert
      await expect(controller.logout(user)).rejects.toThrow(
        'Session not found',
      );
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send password reset email successfully', async () => {
      // Arrange
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };
      const expectedMessage = {
        message: 'If the email exists, a reset link has been sent',
      };

      authService.forgotPassword.mockResolvedValue(expectedMessage);

      // Act
      const result = await controller.forgotPassword(forgotPasswordDto);

      // Assert
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(result).toEqual(expectedMessage);
    });

    it('should handle forgot password failure', async () => {
      // Arrange
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };

      authService.forgotPassword.mockRejectedValue(
        new Error('Email service unavailable'),
      );

      // Act & Assert
      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow('Email service unavailable');
    });

    it('should handle forgot password with invalid email', async () => {
      // Arrange
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'invalid-email',
      };

      authService.forgotPassword.mockRejectedValue(
        new BadRequestException('Invalid email format'),
      );

      // Act & Assert
      await expect(
        controller.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow('Invalid email format');
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password successfully with valid token', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        token: 'valid-reset-token',
        password: 'NewSecurePass123!',
      };
      const expectedMessage = { message: 'Password reset successfully' };

      authService.resetPassword.mockResolvedValue(expectedMessage);

      // Act
      const result = await controller.resetPassword(resetPasswordDto);

      // Assert
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.token,
        resetPasswordDto.password,
      );
      expect(result).toEqual(expectedMessage);
    });

    it('should handle password reset failure with invalid token', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        token: 'invalid-reset-token',
        password: 'NewSecurePass123!',
      };

      authService.resetPassword.mockRejectedValue(
        new UnauthorizedException('Invalid or expired reset token'),
      );

      // Act & Assert
      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Invalid or expired reset token',
      );
    });

    it('should handle password reset failure with weak password', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        token: 'valid-reset-token',
        password: '123', // too weak
      };

      authService.resetPassword.mockRejectedValue(
        new BadRequestException('Password too weak'),
      );

      // Act & Assert
      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Password too weak',
      );
    });

    it('should handle password reset failure with missing token', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordDto = {
        token: '',
        password: 'NewSecurePass123!',
      };

      authService.resetPassword.mockRejectedValue(
        new BadRequestException('Reset token is required'),
      );

      // Act & Assert
      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        'Reset token is required',
      );
    });
  });
});
