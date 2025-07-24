/**
 * Test Data Factory - Factory Pattern Implementation
 *
 * This factory provides a clean, reusable way to create test data
 * using the Factory pattern for consistent object creation.
 */

import { User } from '../../../database/entities/user.entity';
import { Role } from '../../../database/entities/role.entity';
import { AuthSession } from '../../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../../database/entities/auth-password-reset.entity';

// Import all auth DTOs
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
} from '../../../auth/dto';

import {
  AuthTokensWithUserDto,
  AuthRefreshTokenDto,
  UserInfoDto,
  TokenDto,
} from '../../../auth/dto/auth.dto';

import { IJwtPayload } from '../../../auth/interfaces/jwt-payload.interface';

export class TestDataFactory {
  // ========================================
  // ENTITY FACTORIES
  // ========================================

  /**
   * Creates a test user with default values
   */
  static createUser(overrides: Partial<User> = {}): User {
    const defaultUser: Partial<User> = {
      uuid: 'test-user-uuid-123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: '$2b$12$hashedpassword123',
      isActive: true,
      emailVerified: true,
      bio: 'Test user bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      roleUuid: 'test-role-uuid',
      role: TestDataFactory.createRole(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return { ...defaultUser, ...overrides } as User;
  }

  /**
   * Creates a test role with default values
   */
  static createRole(overrides: Partial<Role> = {}): Role {
    const defaultRole: Partial<Role> = {
      uuid: 'test-role-uuid',
      name: 'user',
      description: 'Regular user role',
      permissions: {
        'read:posts': true,
        'write:posts': true,
        'read:profile': true,
        'write:profile': true,
        'read:comments': true,
        'write:comments': true,
      },
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return { ...defaultRole, ...overrides } as Role;
  }

  /**
   * Creates test auth session
   */
  static createAuthSession(overrides: Partial<AuthSession> = {}): AuthSession {
    const defaultSession: Partial<AuthSession> = {
      uuid: 'test-session-uuid',
      userUuid: 'test-user-uuid-123',
      refreshTokenHash: '$2b$12$hashedrefreshtoken123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      deviceInfo: 'Test Device',
      ipAddress: '127.0.0.1',
      user: TestDataFactory.createUser(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return { ...defaultSession, ...overrides } as AuthSession;
  }

  /**
   * Creates test password reset entity
   */
  static createPasswordReset(
    overrides: Partial<AuthPasswordReset> = {},
  ): AuthPasswordReset {
    const defaultReset: Partial<AuthPasswordReset> = {
      uuid: 'test-reset-uuid',
      userUuid: 'test-user-uuid-123',
      tokenHash: '$2b$12$hashedresettoken123',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      isUsed: false,
      user: TestDataFactory.createUser(),
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    };

    return { ...defaultReset, ...overrides } as AuthPasswordReset;
  }

  // ========================================
  // REQUEST PAYLOAD DTO FACTORIES
  // ========================================

  /**
   * Creates test login payload DTO
   */
  static createLoginDto(
    overrides: Partial<LoginPayloadDto> = {},
  ): LoginPayloadDto {
    const defaultLoginDto: LoginPayloadDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    return { ...defaultLoginDto, ...overrides };
  }

  /**
   * Creates test register payload DTO
   */
  static createRegisterDto(
    overrides: Partial<RegisterPayloadDto> = {},
  ): RegisterPayloadDto {
    const defaultRegisterDto: RegisterPayloadDto = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'SecurePass123!',
      firstName: 'New',
      lastName: 'User',
    };

    return { ...defaultRegisterDto, ...overrides };
  }

  /**
   * Creates test refresh token payload DTO
   */
  static createRefreshTokenDto(
    overrides: Partial<RefreshTokenPayloadDto> = {},
  ): RefreshTokenPayloadDto {
    const defaultRefreshDto: RefreshTokenPayloadDto = {
      refreshToken: 'test-refresh-token-456',
    };

    return { ...defaultRefreshDto, ...overrides };
  }

  /**
   * Creates test forgot password payload DTO
   */
  static createForgotPasswordDto(
    overrides: Partial<ForgotPasswordPayloadDto> = {},
  ): ForgotPasswordPayloadDto {
    const defaultForgotDto: ForgotPasswordPayloadDto = {
      email: 'test@example.com',
    };

    return { ...defaultForgotDto, ...overrides };
  }

  /**
   * Creates test reset password payload DTO
   */
  static createResetPasswordDto(
    overrides: Partial<ResetPasswordPayloadDto> = {},
  ): ResetPasswordPayloadDto {
    const defaultResetDto: ResetPasswordPayloadDto = {
      token: 'test-reset-token-123',
      password: 'NewSecurePass123!',
    };

    return { ...defaultResetDto, ...overrides };
  }

  // ========================================
  // DATA TRANSFER OBJECT FACTORIES
  // ========================================

  /**
   * Creates test token DTO
   */
  static createTokenDto(overrides: Partial<TokenDto> = {}): TokenDto {
    const defaultTokens: TokenDto = {
      access_token: 'test-access-token-123',
      refresh_token: 'test-refresh-token-456',
    };

    return { ...defaultTokens, ...overrides };
  }

  /**
   * Creates test user info DTO
   */
  static createUserInfoDto(overrides: Partial<UserInfoDto> = {}): UserInfoDto {
    const defaultUserInfo: UserInfoDto = {
      uuid: 'test-user-uuid-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      role: {
        name: 'user',
      },
    };

    return { ...defaultUserInfo, ...overrides };
  }

  /**
   * Creates test authentication tokens with user
   */
  static createAuthTokens(
    overrides: Partial<AuthTokensWithUserDto> = {},
  ): AuthTokensWithUserDto {
    const defaultTokens: AuthTokensWithUserDto = {
      tokens: TestDataFactory.createTokenDto(),
      user: TestDataFactory.createUserInfoDto(),
    };

    return { ...defaultTokens, ...overrides };
  }

  /**
   * Creates test refresh token data
   */
  static createRefreshTokens(
    overrides: Partial<AuthRefreshTokenDto> = {},
  ): AuthRefreshTokenDto {
    const defaultTokens: AuthRefreshTokenDto = {
      access_token: 'new-access-token-123',
      refresh_token: 'new-refresh-token-456',
    };

    return { ...defaultTokens, ...overrides };
  }

  /**
   * Creates test JWT payload
   */
  static createJwtPayload(overrides: Partial<IJwtPayload> = {}): IJwtPayload {
    const defaultPayload: IJwtPayload = {
      sub: 'test-user-uuid-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user',
      permissions: {
        'read:posts': true,
        'write:posts': true,
        'read:profile': true,
        'write:profile': true,
        'read:comments': true,
        'write:comments': true,
      },
      sessionId: 'test-session-uuid',
    };

    return { ...defaultPayload, ...overrides };
  }

  // ========================================
  // RESPONSE DTO FACTORIES
  // ========================================

  /**
   * Creates test login response DTO
   */
  static createLoginResponse(
    tokens?: AuthTokensWithUserDto,
  ): LoginResponseDto {
    const authTokens = tokens || TestDataFactory.createAuthTokens();
    return new LoginResponseDto(authTokens);
  }

  /**
   * Creates test register response DTO
   */
  static createRegisterResponse(
    tokens?: AuthTokensWithUserDto,
  ): RegisterResponseDto {
    const authTokens = tokens || TestDataFactory.createAuthTokens();
    return new RegisterResponseDto(authTokens);
  }

  /**
   * Creates test refresh token response DTO
   */
  static createRefreshTokenResponse(
    tokens?: AuthRefreshTokenDto,
  ): RefreshTokenResponseDto {
    const refreshTokens = tokens || TestDataFactory.createRefreshTokens();
    return new RefreshTokenResponseDto(refreshTokens);
  }

  /**
   * Creates test logout response DTO
   */
  static createLogoutResponse(): LogoutResponseDto {
    return new LogoutResponseDto();
  }

  /**
   * Creates test forgot password response DTO
   */
  static createForgotPasswordResponse(): ForgotPasswordResponseDto {
    return new ForgotPasswordResponseDto();
  }

  /**
   * Creates test reset password response DTO
   */
  static createResetPasswordResponse(): ResetPasswordResponseDto {
    return new ResetPasswordResponseDto();
  }

  // ========================================
  // EDGE CASE DATA FACTORIES
  // ========================================

  /**
   * Creates an inactive user for testing
   */
  static createInactiveUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser({
      isActive: false,
      emailVerified: false,
      ...overrides,
    });
  }

  /**
   * Creates an admin user for testing
   */
  static createAdminUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser({
      role: TestDataFactory.createRole({
        name: 'admin',
        permissions: {
          'read:all': true,
          'write:all': true,
          'delete:all': true,
          'admin:all': true,
        },
      }),
      ...overrides,
    });
  }

  /**
   * Creates an expired session for testing
   */
  static createExpiredSession(overrides: Partial<AuthSession> = {}): AuthSession {
    return TestDataFactory.createAuthSession({
      expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isActive: false,
      ...overrides,
    });
  }

  /**
   * Creates an expired password reset token for testing
   */
  static createExpiredPasswordReset(
    overrides: Partial<AuthPasswordReset> = {},
  ): AuthPasswordReset {
    return TestDataFactory.createPasswordReset({
      expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      isUsed: false,
      ...overrides,
    });
  }

  /**
   * Creates a used password reset token for testing
   */
  static createUsedPasswordReset(
    overrides: Partial<AuthPasswordReset> = {},
  ): AuthPasswordReset {
    return TestDataFactory.createPasswordReset({
      isUsed: true,
      ...overrides,
    });
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Creates a complete user with all relations
   */
  static createCompleteUser(overrides: Partial<User> = {}): User {
    const role = TestDataFactory.createRole();
    return TestDataFactory.createUser({
      role,
      roleUuid: role.uuid,
      ...overrides,
    });
  }

  /**
   * Creates invalid login credentials for testing error cases
   */
  static createInvalidLoginDto(): LoginPayloadDto {
    return {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };
  }

  /**
   * Creates weak password register DTO for testing validation
   */
  static createWeakPasswordRegisterDto(): RegisterPayloadDto {
    return TestDataFactory.createRegisterDto({
      password: '123', // Too weak
    });
  }

  /**
   * Creates invalid email register DTO for testing validation
   */
  static createInvalidEmailRegisterDto(): RegisterPayloadDto {
    return TestDataFactory.createRegisterDto({
      email: 'invalid-email-format',
    });
  }
}
