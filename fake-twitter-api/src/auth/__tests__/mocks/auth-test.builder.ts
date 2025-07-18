/**
 * Auth Test Builder
 *
 * This builder allows for creating complex test scenarios with
 * multiple related objects in a fluent, readable way.
 */

import { User } from '../../../database/entities/user.entity';
import { AuthSession } from '../../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../../database/entities/auth-password-reset.entity';
import { LoginDto, RegisterDto } from '../../dto';
import { AuthTokensWithUserDto, AuthRefreshTokenDto } from '../../dto/auth.dto';
import { TestDataFactory } from '../../../common/__tests__/test-utils';

export interface IAuthTestScenario {
  user?: User;
  tokens?: AuthTokensWithUserDto;
  refreshTokens?: AuthRefreshTokenDto;
  loginDto?: LoginDto;
  registerDto?: RegisterDto;
  session?: AuthSession;
  passwordReset?: AuthPasswordReset;
  error?: Error;
}

export class AuthTestBuilder {
  private scenario: IAuthTestScenario = {};

  /**
   * Adds a user to the test scenario
   */
  withUser(user: User | Partial<User>): this {
    this.scenario.user =
      'uuid' in user ? (user as User) : TestDataFactory.createUser(user);
    return this;
  }

  /**
   * Adds authentication tokens to the test scenario
   */
  withTokens(
    tokens: AuthTokensWithUserDto | Partial<AuthTokensWithUserDto>,
  ): this {
    this.scenario.tokens =
      'tokens' in tokens
        ? (tokens as AuthTokensWithUserDto)
        : TestDataFactory.createAuthTokens(tokens);
    return this;
  }

  /**
   * Adds refresh token response to the test scenario
   */
  withRefreshTokens(
    refreshTokens: AuthRefreshTokenDto | Partial<AuthRefreshTokenDto>,
  ): this {
    this.scenario.refreshTokens =
      'access_token' in refreshTokens
        ? (refreshTokens as AuthRefreshTokenDto)
        : TestDataFactory.createRefreshTokenResponse(refreshTokens);
    return this;
  }

  /**
   * Adds login DTO to the test scenario
   */
  withLoginDto(loginDto: LoginDto | Partial<LoginDto>): this {
    this.scenario.loginDto =
      'email' in loginDto
        ? (loginDto as LoginDto)
        : TestDataFactory.createLoginDto(loginDto);
    return this;
  }

  /**
   * Adds register DTO to the test scenario
   */
  withRegisterDto(registerDto: RegisterDto | Partial<RegisterDto>): this {
    this.scenario.registerDto =
      'email' in registerDto
        ? (registerDto as RegisterDto)
        : TestDataFactory.createRegisterDto(registerDto);
    return this;
  }

  /**
   * Adds auth session to the test scenario
   */
  withSession(session: AuthSession | Partial<AuthSession>): this {
    this.scenario.session =
      'uuid' in session
        ? (session as AuthSession)
        : TestDataFactory.createAuthSession(session);
    return this;
  }

  /**
   * Adds password reset to the test scenario
   */
  withPasswordReset(
    passwordReset: AuthPasswordReset | Partial<AuthPasswordReset>,
  ): this {
    this.scenario.passwordReset =
      'uuid' in passwordReset
        ? (passwordReset as AuthPasswordReset)
        : TestDataFactory.createPasswordReset(passwordReset);
    return this;
  }

  /**
   * Adds an error to the test scenario
   */
  withError(error: Error): this {
    this.scenario.error = error;
    return this;
  }

  /**
   * Builds the complete test scenario
   */
  build(): IAuthTestScenario {
    return { ...this.scenario };
  }

  // Predefined scenarios for common test cases
  static createSuccessfulLoginScenario(): AuthTestBuilder {
    return new AuthTestBuilder()
      .withUser({ email: 'test@example.com', username: 'testuser' })
      .withLoginDto({ email: 'test@example.com', password: 'password123' })
      .withTokens({
        tokens: {
          access_token: 'valid-access-token',
          refresh_token: 'valid-refresh-token',
        },
      });
  }

  static createFailedLoginScenario(): AuthTestBuilder {
    return new AuthTestBuilder()
      .withLoginDto({ email: 'invalid@example.com', password: 'wrongpassword' })
      .withError(new Error('Invalid credentials'));
  }

  static createSuccessfulRegistrationScenario(): AuthTestBuilder {
    return new AuthTestBuilder()
      .withRegisterDto({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'SecurePass123!',
        firstName: 'New',
        lastName: 'User',
      })
      .withTokens({
        tokens: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        },
        user: {
          uuid: 'new-user-uuid',
          username: 'newuser',
          firstName: 'New',
          lastName: 'User',
          role: { name: 'user' },
        },
      });
  }
}
