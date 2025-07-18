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
import { LoginDto, RegisterDto } from '../../../auth/dto';
import {
  AuthTokensWithUserDto,
  AuthRefreshTokenDto,
} from '../../../auth/dto/auth.dto';

export class TestDataFactory {
  /**
   * Creates a test user with default values
   *
   * @param overrides - Optional properties to override default values
   * @returns User entity with test data
   *
   * Example usage:
   * const user = TestDataFactory.createUser({
   *   email: 'admin@test.com',
   *   role: { name: 'admin' }
   * });
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
      role: {
        uuid: 'test-role-uuid',
        name: 'user',
      } as Role,
    };

    return { ...defaultUser, ...overrides } as User;
  }

  /**
   * Creates a test role with default values
   *
   * @param overrides - Optional properties to override default values
   * @returns Role entity with test data
   */
  static createRole(overrides: Partial<Role> = {}): Role {
    const defaultRole: Partial<Role> = {
      uuid: 'test-role-uuid',
      name: 'user',
    };

    return { ...defaultRole, ...overrides } as Role;
  }

  /**
   * Creates test authentication tokens
   *
   * @param overrides - Optional properties to override default values
   * @returns AuthTokensWithUserDto with test data
   */
  static createAuthTokens(
    overrides: Partial<AuthTokensWithUserDto> = {},
  ): AuthTokensWithUserDto {
    const defaultTokens: AuthTokensWithUserDto = {
      tokens: {
        access_token: 'test-access-token-123',
        refresh_token: 'test-refresh-token-456',
      },
      user: {
        uuid: 'test-user-uuid-123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: {
          name: 'user',
        },
      },
    };

    return { ...defaultTokens, ...overrides };
  }

  /**
   * Creates test refresh token response
   *
   * @param overrides - Optional properties to override default values
   * @returns AuthRefreshTokenDto with test data
   */
  static createRefreshTokenResponse(
    overrides: Partial<AuthRefreshTokenDto> = {},
  ): AuthRefreshTokenDto {
    const defaultResponse: AuthRefreshTokenDto = {
      access_token: 'new-access-token-123',
      refresh_token: 'new-refresh-token-456',
    };

    return { ...defaultResponse, ...overrides };
  }

  /**
   * Creates test login DTO
   *
   * @param overrides - Optional properties to override default values
   * @returns LoginDto with test data
   */
  static createLoginDto(overrides: Partial<LoginDto> = {}): LoginDto {
    const defaultLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    return { ...defaultLoginDto, ...overrides };
  }

  /**
   * Creates test register DTO
   *
   * @param overrides - Optional properties to override default values
   * @returns RegisterDto with test data
   */
  static createRegisterDto(overrides: Partial<RegisterDto> = {}): RegisterDto {
    const defaultRegisterDto: RegisterDto = {
      email: 'newuser@example.com',
      username: 'newuser',
      password: 'SecurePass123!',
      firstName: 'New',
      lastName: 'User',
    };

    return { ...defaultRegisterDto, ...overrides };
  }

  /**
   * Creates test auth session
   *
   * @param overrides - Optional properties to override default values
   * @returns AuthSession entity with test data
   */
  static createAuthSession(overrides: Partial<AuthSession> = {}): AuthSession {
    const defaultSession: Partial<AuthSession> = {
      uuid: 'test-session-uuid',
      userUuid: 'test-user-uuid-123',
      refreshTokenHash: '$2b$12$hashedrefreshtoken123',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      user: TestDataFactory.createUser(),
    };

    return { ...defaultSession, ...overrides } as AuthSession;
  }

  /**
   * Creates test password reset entity
   *
   * @param overrides - Optional properties to override default values
   * @returns AuthPasswordReset entity with test data
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
    };

    return { ...defaultReset, ...overrides } as AuthPasswordReset;
  }
}
