/**
 * Main Authentication Service - Orchestrates all auth operations
 */

import { Injectable, Logger } from '@nestjs/common';
import {
  ForgotPasswordPayloadDto,
  ForgotPasswordResponseDto,
  LoginPayloadDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenPayloadDto,
  RefreshTokenResponseDto,
  RegisterPayloadDto,
  RegisterResponseDto,
  ResetPasswordPayloadDto,
  ResetPasswordResponseDto,
} from '../dto';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthTokenService } from './auth-token.service';
import { AuthUserService } from './auth-user.service';
import { AuthPasswordService } from './auth-password.service';
import { AuthSessionService } from './auth-session.service';
import { AuthErrorHandler } from './auth-error-handler.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: AuthTokenService,
    private readonly userService: AuthUserService,
    private readonly passwordService: AuthPasswordService,
    private readonly sessionService: AuthSessionService,
    private readonly errorHandler: AuthErrorHandler,
  ) {}

  async login(payload: LoginPayloadDto): Promise<LoginResponseDto> {
    /*
    This method is used to login a user.

    @param payload - Login payload
    @returns Login response
    */
    try {
      // 1. Validate user credentials
      const user = await this.userService.validateCredentials(
        payload.email,
        payload.password,
      );

      // 2. Generate tokens and create session
      const tokens = await this.tokenService.generateTokens(user);

      this.logger.log(`User logged in: ${user.email}`);
      return new LoginResponseDto(tokens);
    } catch (error) {
      return this.errorHandler.handleLoginError(error);
    }
  }

  async register(payload: RegisterPayloadDto): Promise<RegisterResponseDto> {
    /*
    This method is used to register a new user.

    @param payload - Register payload
    @returns Register response
    */
    try {
      // 1. Create user account
      const user = await this.userService.createUser(payload);

      // 2. Generate tokens and create session
      const tokens = await this.tokenService.generateTokens(user);

      this.logger.log(`User registered: ${user.email}`);
      return new RegisterResponseDto(tokens);
    } catch (error) {
      return this.errorHandler.handleRegistrationError(error, payload);
    }
  }

  async refresh(
    payload: RefreshTokenPayloadDto,
  ): Promise<RefreshTokenResponseDto> {
    /*
    This method is used to refresh the tokens of a user.

    @param payload - Refresh token payload
    @returns Refresh token response
    */
    try {
      // 1. Validate refresh token and get session
      const { user, sessionId } = await this.tokenService.validateRefreshToken(
        payload.refreshToken,
      );

      // 2. Generate new tokens
      const tokens = await this.tokenService.generateTokens(user, sessionId);

      this.logger.log(`Tokens refreshed for user: ${user.email}`);
      return new RefreshTokenResponseDto(tokens.tokens);
    } catch (error) {
      return this.errorHandler.handleRefreshError(error);
    }
  }

  async logout(user: IJwtPayload): Promise<LogoutResponseDto> {
    /*
    This method is used to logout a user.

    @param user - User JWT payload
    @returns Logout response
    */
    try {
      await this.sessionService.invalidateSession(user.sessionId);
      this.logger.log(`User logged out: ${user.email}`);
      return new LogoutResponseDto();
    } catch (error) {
      return this.errorHandler.handleLogoutError(error);
    }
  }

  async forgotPassword(
    payload: ForgotPasswordPayloadDto,
  ): Promise<ForgotPasswordResponseDto> {
    /*
    This method is used to initiate a password reset.

    @param payload - Forgot password payload
    @returns Forgot password response
    */
    try {
      await this.passwordService.initiatePasswordReset(payload.email);
      return new ForgotPasswordResponseDto();
    } catch (error) {
      this.logger.warn(`Password reset attempt for: ${payload.email}`);
      return new ForgotPasswordResponseDto();
    }
  }

  async resetPassword(
    payload: ResetPasswordPayloadDto,
  ): Promise<ResetPasswordResponseDto> {
    /*
    This method is used to reset a user's password.

    @param payload - Reset password payload
    @returns Reset password response
    */
    try {
      await this.passwordService.resetPassword(payload.token, payload.password);
      this.logger.log('Password reset successfully');
      return new ResetPasswordResponseDto();
    } catch (error) {
      return this.errorHandler.handlePasswordResetError(error);
    }
  }
}
