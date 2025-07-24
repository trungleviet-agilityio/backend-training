/**
 * Auth Test Builder - Updated for new service architecture
 * Builder Pattern Implementation for complex test scenarios
 */

import { User } from '../../../database/entities/user.entity';
import { AuthSession } from '../../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../../database/entities/auth-password-reset.entity';

// Import all DTOs
import {
  LoginPayloadDto,
  RegisterPayloadDto,
  RefreshTokenPayloadDto,
  ForgotPasswordPayloadDto,
  ResetPasswordPayloadDto,
  LoginResponseDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  LogoutResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
} from '../../dto';

import {
  AuthTokensWithUserDto,
  AuthRefreshTokenDto,
  UserInfoDto,
} from '../../dto/auth.dto';

import { IJwtPayload } from '../../interfaces/jwt-payload.interface';
import { TestDataFactory } from '../../../common/__tests__/test-utils';

export interface IAuthTestScenario {
  // Entities
  user?: User;
  session?: AuthSession;
  passwordReset?: AuthPasswordReset;

  // JWT payload
  jwtPayload?: IJwtPayload;

  // Request DTOs
  loginPayloadDto?: LoginPayloadDto;
  registerPayloadDto?: RegisterPayloadDto;
  refreshTokenPayloadDto?: RefreshTokenPayloadDto;
  forgotPasswordPayloadDto?: ForgotPasswordPayloadDto;
  resetPasswordPayloadDto?: ResetPasswordPayloadDto;

  // Response DTOs
  loginResponseDto?: LoginResponseDto;
  registerResponseDto?: RegisterResponseDto;
  refreshTokenResponseDto?: RefreshTokenResponseDto;
  logoutResponseDto?: LogoutResponseDto;
  forgotPasswordResponseDto?: ForgotPasswordResponseDto;
  resetPasswordResponseDto?: ResetPasswordResponseDto;

  // Data objects
  tokens?: AuthTokensWithUserDto;
  refreshTokens?: AuthRefreshTokenDto;
  userInfo?: UserInfoDto;

  // Error scenarios
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
   * Adds session to the test scenario
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
   * Adds JWT payload to the test scenario
   */
  withJwtPayload(payload: IJwtPayload | Partial<IJwtPayload>): this {
    this.scenario.jwtPayload =
      'sub' in payload
        ? (payload as IJwtPayload)
        : TestDataFactory.createJwtPayload(payload);
    return this;
  }

  /**
   * Adds login payload DTO
   */
  withLoginDto(loginDto: LoginPayloadDto | Partial<LoginPayloadDto>): this {
    this.scenario.loginPayloadDto =
      'email' in loginDto
        ? (loginDto as LoginPayloadDto)
        : TestDataFactory.createLoginDto(loginDto);
    return this;
  }

  /**
   * Adds register payload DTO
   */
  withRegisterDto(
    registerDto: RegisterPayloadDto | Partial<RegisterPayloadDto>,
  ): this {
    this.scenario.registerPayloadDto =
      'email' in registerDto
        ? (registerDto as RegisterPayloadDto)
        : TestDataFactory.createRegisterDto(registerDto);
    return this;
  }

  /**
   * Adds refresh token payload DTO
   */
  withRefreshTokenDto(
    refreshDto: RefreshTokenPayloadDto | Partial<RefreshTokenPayloadDto>,
  ): this {
    this.scenario.refreshTokenPayloadDto =
      'refreshToken' in refreshDto
        ? (refreshDto as RefreshTokenPayloadDto)
        : TestDataFactory.createRefreshTokenDto(refreshDto);
    return this;
  }

  /**
   * Adds forgot password payload DTO
   */
  withForgotPasswordDto(
    forgotDto: ForgotPasswordPayloadDto | Partial<ForgotPasswordPayloadDto>,
  ): this {
    this.scenario.forgotPasswordPayloadDto =
      'email' in forgotDto
        ? (forgotDto as ForgotPasswordPayloadDto)
        : TestDataFactory.createForgotPasswordDto(forgotDto);
    return this;
  }

  /**
   * Adds reset password payload DTO
   */
  withResetPasswordDto(
    resetDto: ResetPasswordPayloadDto | Partial<ResetPasswordPayloadDto>,
  ): this {
    this.scenario.resetPasswordPayloadDto =
      'token' in resetDto
        ? (resetDto as ResetPasswordPayloadDto)
        : TestDataFactory.createResetPasswordDto(resetDto);
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
   * Adds refresh tokens to the test scenario
   */
  withRefreshTokens(
    tokens: AuthRefreshTokenDto | Partial<AuthRefreshTokenDto>,
  ): this {
    this.scenario.refreshTokens =
      'access_token' in tokens
        ? (tokens as AuthRefreshTokenDto)
        : TestDataFactory.createRefreshTokens(tokens);
    return this;
  }

  /**
   * Adds user info to the test scenario
   */
  withUserInfo(userInfo: UserInfoDto | Partial<UserInfoDto>): this {
    this.scenario.userInfo =
      'uuid' in userInfo
        ? (userInfo as UserInfoDto)
        : TestDataFactory.createUserInfoDto(userInfo);
    return this;
  }

  /**
   * Adds login response DTO
   */
  withLoginResponse(tokens?: AuthTokensWithUserDto): this {
    const authTokens =
      tokens || this.scenario.tokens || TestDataFactory.createAuthTokens();
    this.scenario.loginResponseDto =
      TestDataFactory.createLoginResponse(authTokens);
    return this;
  }

  /**
   * Adds register response DTO
   */
  withRegisterResponse(tokens?: AuthTokensWithUserDto): this {
    const authTokens =
      tokens || this.scenario.tokens || TestDataFactory.createAuthTokens();
    this.scenario.registerResponseDto =
      TestDataFactory.createRegisterResponse(authTokens);
    return this;
  }

  /**
   * Adds refresh response DTO
   */
  withRefreshResponse(tokens?: AuthRefreshTokenDto): this {
    const refreshTokens =
      tokens ||
      this.scenario.refreshTokens ||
      TestDataFactory.createRefreshTokens();
    this.scenario.refreshTokenResponseDto =
      TestDataFactory.createRefreshTokenResponse(refreshTokens);
    return this;
  }

  /**
   * Adds logout response DTO
   */
  withLogoutResponse(): this {
    this.scenario.logoutResponseDto = TestDataFactory.createLogoutResponse();
    return this;
  }

  /**
   * Adds forgot password response DTO
   */
  withForgotPasswordResponse(): this {
    this.scenario.forgotPasswordResponseDto =
      TestDataFactory.createForgotPasswordResponse();
    return this;
  }

  /**
   * Adds reset password response DTO
   */
  withResetPasswordResponse(): this {
    this.scenario.resetPasswordResponseDto =
      TestDataFactory.createResetPasswordResponse();
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
   * Builds and returns the test scenario
   */
  build(): IAuthTestScenario {
    return { ...this.scenario };
  }

  /**
   * Builds a complete login scenario
   */
  buildLoginScenario(): Required<
    Pick<IAuthTestScenario, 'loginPayloadDto' | 'tokens' | 'loginResponseDto'>
  > {
    if (!this.scenario.loginPayloadDto) {
      this.withLoginDto({});
    }
    if (!this.scenario.tokens) {
      this.withTokens({});
    }
    if (!this.scenario.loginResponseDto) {
      this.withLoginResponse(this.scenario.tokens!);
    }

    return {
      loginPayloadDto: this.scenario.loginPayloadDto!,
      tokens: this.scenario.tokens!,
      loginResponseDto: this.scenario.loginResponseDto!,
    };
  }

  /**
   * Builds a complete registration scenario
   */
  buildRegisterScenario(): Required<
    Pick<
      IAuthTestScenario,
      'registerPayloadDto' | 'tokens' | 'registerResponseDto'
    >
  > {
    if (!this.scenario.registerPayloadDto) {
      this.withRegisterDto({});
    }
    if (!this.scenario.tokens) {
      this.withTokens({});
    }
    if (!this.scenario.registerResponseDto) {
      this.withRegisterResponse(this.scenario.tokens!);
    }

    return {
      registerPayloadDto: this.scenario.registerPayloadDto!,
      tokens: this.scenario.tokens!,
      registerResponseDto: this.scenario.registerResponseDto!,
    };
  }

  /**
   * Builds a complete refresh scenario
   */
  buildRefreshScenario(): Required<
    Pick<
      IAuthTestScenario,
      'refreshTokenPayloadDto' | 'refreshTokens' | 'refreshTokenResponseDto'
    >
  > {
    if (!this.scenario.refreshTokenPayloadDto) {
      this.withRefreshTokenDto({});
    }
    if (!this.scenario.refreshTokens) {
      this.withRefreshTokens({});
    }
    if (!this.scenario.refreshTokenResponseDto) {
      this.withRefreshResponse(this.scenario.refreshTokens!);
    }

    return {
      refreshTokenPayloadDto: this.scenario.refreshTokenPayloadDto!,
      refreshTokens: this.scenario.refreshTokens!,
      refreshTokenResponseDto: this.scenario.refreshTokenResponseDto!,
    };
  }

  /**
   * Builds a complete logout scenario
   */
  buildLogoutScenario(): Required<
    Pick<IAuthTestScenario, 'jwtPayload' | 'logoutResponseDto'>
  > {
    if (!this.scenario.jwtPayload) {
      this.withJwtPayload({});
    }
    if (!this.scenario.logoutResponseDto) {
      this.withLogoutResponse();
    }

    return {
      jwtPayload: this.scenario.jwtPayload!,
      logoutResponseDto: this.scenario.logoutResponseDto!,
    };
  }

  /**
   * Builds a complete forgot password scenario
   */
  buildForgotPasswordScenario(): Required<
    Pick<
      IAuthTestScenario,
      'forgotPasswordPayloadDto' | 'forgotPasswordResponseDto'
    >
  > {
    if (!this.scenario.forgotPasswordPayloadDto) {
      this.withForgotPasswordDto({});
    }
    if (!this.scenario.forgotPasswordResponseDto) {
      this.withForgotPasswordResponse();
    }

    return {
      forgotPasswordPayloadDto: this.scenario.forgotPasswordPayloadDto!,
      forgotPasswordResponseDto: this.scenario.forgotPasswordResponseDto!,
    };
  }

  /**
   * Builds a complete reset password scenario
   */
  buildResetPasswordScenario(): Required<
    Pick<
      IAuthTestScenario,
      'resetPasswordPayloadDto' | 'resetPasswordResponseDto'
    >
  > {
    if (!this.scenario.resetPasswordPayloadDto) {
      this.withResetPasswordDto({});
    }
    if (!this.scenario.resetPasswordResponseDto) {
      this.withResetPasswordResponse();
    }

    return {
      resetPasswordPayloadDto: this.scenario.resetPasswordPayloadDto!,
      resetPasswordResponseDto: this.scenario.resetPasswordResponseDto!,
    };
  }

  /**
   * Builds an error scenario for login
   */
  buildLoginErrorScenario(
    error: Error,
  ): Required<Pick<IAuthTestScenario, 'loginPayloadDto' | 'error'>> {
    if (!this.scenario.loginPayloadDto) {
      this.withLoginDto({});
    }
    this.withError(error);

    return {
      loginPayloadDto: this.scenario.loginPayloadDto!,
      error: this.scenario.error!,
    };
  }

  /**
   * Builds an inactive user scenario
   */
  buildInactiveUserScenario(): Required<
    Pick<IAuthTestScenario, 'user' | 'loginPayloadDto'>
  > {
    const inactiveUser = TestDataFactory.createInactiveUser();
    this.withUser(inactiveUser);
    this.withLoginDto({ email: inactiveUser.email });

    return {
      user: this.scenario.user!,
      loginPayloadDto: this.scenario.loginPayloadDto!,
    };
  }

  /**
   * Builds an expired session scenario
   */
  buildExpiredSessionScenario(): Required<
    Pick<IAuthTestScenario, 'session' | 'refreshTokenPayloadDto'>
  > {
    const expiredSession = TestDataFactory.createExpiredSession();
    this.withSession(expiredSession);
    this.withRefreshTokenDto({});

    return {
      session: this.scenario.session!,
      refreshTokenPayloadDto: this.scenario.refreshTokenPayloadDto!,
    };
  }
}
