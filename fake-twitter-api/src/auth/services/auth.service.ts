/**
 * Auth service
 */

import { Injectable, Logger } from '@nestjs/common';
import { AuthOperationFactory } from '../factories/auth-operation.factory';
import {
  AuthRefreshTokenDto,
  AuthTokensWithUserDto,
  LoginDto,
  RegisterDto,
} from '../dto';
import { User } from '../../database/entities/user.entity';
import { AuthPasswordResetService } from './auth-password-reset.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * Constructor
   *
   * @param authOperationFactory - Auth operation factory
   * @param authPasswordResetService - Auth password reset service
   */
  constructor(
    private readonly authOperationFactory: AuthOperationFactory,
    private readonly authPasswordResetService: AuthPasswordResetService,
  ) {}

  /**
   * Login
   *
   * @param loginDto - Login DTO
   * @returns Auth tokens with user
   */
  async login(loginDto: LoginDto): Promise<AuthTokensWithUserDto> {
    const strategy = this.authOperationFactory.createStrategy();
    return strategy.authenticate(loginDto);
  }

  /**
   * Register
   *
   * @param registerDto - Register DTO
   * @returns Auth tokens with user
   */
  async register(registerDto: RegisterDto): Promise<AuthTokensWithUserDto> {
    const strategy = this.authOperationFactory.createStrategy();
    return strategy.register(registerDto);
  }

  /**
   * Refresh
   *
   * @param refreshToken - Refresh token
   * @returns Auth refresh token
   */
  async refresh(refreshToken: string): Promise<AuthRefreshTokenDto> {
    const strategy = this.authOperationFactory.createStrategy();
    return strategy.refreshToken(refreshToken);
  }

  /**
   * Logout
   *
   * @param sessionId - Session ID
   */
  async logout(sessionId: string): Promise<void> {
    const strategy = this.authOperationFactory.createStrategy();
    return strategy.logout(sessionId);
  }

  /**
   * Validate user
   *
   * @param token - Token
   * @returns User
   */
  async validateUser(token: string): Promise<User> {
    const strategy = this.authOperationFactory.createStrategy();
    return strategy.validateToken(token);
  }

  /**
   * Forgot password
   *
   * @param email - Email
   * @returns Message
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.authPasswordResetService.forgotPassword(email);
  }

  /**
   * Reset password
   *
   * @param token - Token
   * @param newPassword - New password
   * @returns Message
   */
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    return this.authPasswordResetService.resetPassword(token, newPassword);
  }
}
