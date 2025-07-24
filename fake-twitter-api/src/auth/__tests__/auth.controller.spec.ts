/**
 * AuthController Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthTestBuilder } from './mocks/auth-test.builder';
import { AuthMockProvider } from './mocks/auth-mock.provider';
import {
  RefreshTokenPayloadDto,
  ForgotPasswordPayloadDto,
  ResetPasswordPayloadDto,
  UserInfoDto,
} from '../dto';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
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
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register user successfully with valid data', async () => {
      // Arrange
      const scenario = new AuthTestBuilder().buildRegisterScenario();

      authService.register.mockResolvedValue(scenario.registerResponseDto);

      // Act
      const result = await controller.register(scenario.registerPayloadDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(
        scenario.registerPayloadDto,
      );
      expect(result).toEqual(scenario.registerResponseDto);
    });

    it('should handle registration validation errors', async () => {
      // Arrange
      const invalidRegisterDto = TestDataFactory.createRegisterDto({
        email: 'invalid-email',
        password: '123',
      });

      authService.register.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(controller.register(invalidRegisterDto)).rejects.toThrow(
        'Validation failed',
      );
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const scenario = new AuthTestBuilder().buildLoginScenario();

      authService.login.mockResolvedValue(scenario.loginResponseDto);

      // Act
      const result = await controller.login(scenario.loginPayloadDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(scenario.loginPayloadDto);
      expect(result).toEqual(scenario.loginResponseDto);
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
  });

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenPayloadDto = {
        refreshToken: 'valid-refresh-token',
      };
      const expectedTokens = TestDataFactory.createRefreshTokenResponse();

      authService.refresh.mockResolvedValue(expectedTokens);

      // Act
      const result = await controller.refresh(refreshTokenDto);

      // Assert
      expect(authService.refresh).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual(expectedTokens);
    });

    it('should handle refresh failure with invalid refresh token', async () => {
      // Arrange
      const refreshTokenDto: RefreshTokenPayloadDto = {
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
  });

  describe('POST /auth/logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const user: IJwtPayload = {
        sub: 'test-user-uuid',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        permissions: {},
        sessionId: 'test-session-id',
      };

      const logoutResponse = TestDataFactory.createLogoutResponse();
      authService.logout.mockResolvedValue(logoutResponse);

      // Act
      const result = await controller.logout(
        user as IJwtPayload & { user: UserInfoDto },
      );

      // Assert
      expect(authService.logout).toHaveBeenCalledWith(user);
      expect(result).toEqual(logoutResponse);
    });

    it('should handle logout failure', async () => {
      // Arrange
      const user: IJwtPayload = {
        sub: 'invalid-user-uuid',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        permissions: {},
        sessionId: 'invalid-session-id',
      };

      authService.logout.mockRejectedValue(new Error('Session not found'));

      // Act & Assert
      await expect(
        controller.logout(user as IJwtPayload & { user: UserInfoDto }),
      ).rejects.toThrow('Session not found');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send password reset email successfully', async () => {
      // Arrange
      const forgotPasswordDto: ForgotPasswordPayloadDto = {
        email: 'test@example.com',
      };
      const expectedResponse = TestDataFactory.createForgotPasswordResponse();

      authService.forgotPassword.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.forgotPassword(forgotPasswordDto);

      // Assert
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password successfully with valid token', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordPayloadDto = {
        token: 'valid-reset-token',
        password: 'NewSecurePass123!',
      };
      const expectedResponse = TestDataFactory.createResetPasswordResponse();

      authService.resetPassword.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.resetPassword(resetPasswordDto);

      // Assert
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle password reset failure with invalid token', async () => {
      // Arrange
      const resetPasswordDto: ResetPasswordPayloadDto = {
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
  });
});
