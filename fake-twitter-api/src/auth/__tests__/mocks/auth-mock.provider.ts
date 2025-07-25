/**
 * Auth Mock Provider - Fixed TypeScript types
 * Factory Pattern Implementation for consistent test mocks
 */

import {
  DataSource,
  DataSourceOptions,
  EntityManager,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Entities
import { User } from '../../../database/entities/user.entity';
import { Role } from '../../../database/entities/role.entity';
import { AuthSession } from '../../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../../database/entities/auth-password-reset.entity';

// Services
import { AuthService } from '../../services/auth.service';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthTokenService } from '../../services/auth-token.service';
import { AuthPasswordService } from '../../services/auth-password.service';
import { AuthSessionService } from '../../services/auth-session.service';
import { AuthErrorHandler } from '../../services/auth-error-handler.service';
import { AuthPasswordResetService } from '../../services/auth-password-reset.service';

// External services
import { NotificationService } from '../../../notifications/services/notification.service';

// Fixed type definitions with proper constraints
type MockRepository<T extends ObjectLiteral> = Partial<
  Record<keyof Repository<T>, jest.MockedFunction<any>>
>;
type MockService<T extends object> = Partial<
  Record<keyof T, jest.MockedFunction<any>>
>;

export class AuthMockProvider {
  /**
   * Creates mock for main auth service (orchestrator)
   */
  static createAuthService(): jest.Mocked<AuthService> {
    const mockService: MockService<AuthService> = {
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };
    return mockService as jest.Mocked<AuthService>;
  }

  /**
   * Creates mock for auth user service
   */
  static createAuthUserService(): jest.Mocked<AuthUserService> {
    const mockService: MockService<AuthUserService> = {
      validateCredentials: jest.fn(),
      createUser: jest.fn(),
      findByEmail: jest.fn(),
      updatePassword: jest.fn(),
    };
    return mockService as jest.Mocked<AuthUserService>;
  }

  /**
   * Creates mock for auth token service
   */
  static createAuthTokenService(): jest.Mocked<AuthTokenService> {
    const mockService: MockService<AuthTokenService> = {
      generateTokens: jest.fn(),
      validateRefreshToken: jest.fn(),
    };
    return mockService as jest.Mocked<AuthTokenService>;
  }

  /**
   * Creates mock for auth password service
   */
  static createAuthPasswordService(): jest.Mocked<AuthPasswordService> {
    const mockService: MockService<AuthPasswordService> = {
      initiatePasswordReset: jest.fn(),
      resetPassword: jest.fn(),
    };
    return mockService as jest.Mocked<AuthPasswordService>;
  }

  /**
   * Creates mock for auth session service
   */
  static createAuthSessionService(): jest.Mocked<AuthSessionService> {
    const mockService: MockService<AuthSessionService> = {
      invalidateSession: jest.fn(),
      invalidateAllUserSessions: jest.fn(),
    };
    return mockService as jest.Mocked<AuthSessionService>;
  }

  /**
   * Creates mock for auth error handler
   */
  static createAuthErrorHandler(): jest.Mocked<AuthErrorHandler> {
    const mockService: MockService<AuthErrorHandler> = {
      handleLoginError: jest.fn(),
      handleRegistrationError: jest.fn(),
      handleRefreshError: jest.fn(),
      handleLogoutError: jest.fn(),
      handlePasswordResetError: jest.fn(),
    };
    return mockService as jest.Mocked<AuthErrorHandler>;
  }

  /**
   * Creates mock for legacy auth password reset service
   */
  static createAuthPasswordResetService(): jest.Mocked<AuthPasswordResetService> {
    const mockService: MockService<AuthPasswordResetService> = {
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };
    return mockService as jest.Mocked<AuthPasswordResetService>;
  }

  /**
   * Creates mock notification service
   */
  static createNotificationService(): jest.Mocked<NotificationService> {
    const mockService: MockService<NotificationService> = {
      sendPasswordResetEmail: jest.fn(),
      sendPasswordResetSuccessEmail: jest.fn(),
    };
    return mockService as jest.Mocked<NotificationService>;
  }

  /**
   * Creates mock JWT service
   */
  static createJwtService(): jest.Mocked<JwtService> {
    const mockService: MockService<JwtService> = {
      sign: jest.fn(),
      signAsync: jest.fn(),
      verify: jest.fn(),
      verifyAsync: jest.fn(),
      decode: jest.fn(),
    };
    return mockService as jest.Mocked<JwtService>;
  }

  /**
   * Creates mock config service
   */
  static createConfigService(): jest.Mocked<ConfigService> {
    const mockConfig: Record<string, any> = {
      JWT_SECRET: 'test-jwt-secret',
      JWT_ACCESS_TOKEN_EXPIRATION: '15m',
      JWT_REFRESH_TOKEN_EXPIRATION: '7d',
      DB_HOST: 'localhost',
      DB_PORT: 5432,
      DB_USERNAME: 'test',
      DB_PASSWORD: 'test',
      DB_DATABASE: 'test_db',
    };

    const mockService: MockService<ConfigService> = {
      get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
        return mockConfig[key] ?? defaultValue;
      }),
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        const value = mockConfig[key];
        if (value === undefined) {
          throw new Error(`Configuration key "${key}" not found`);
        }
        return value;
      }),
    };
    return mockService as jest.Mocked<ConfigService>;
  }

  /**
   * Creates mock query builder
   */
  private static createMockQueryBuilder<T extends ObjectLiteral>(): jest.Mocked<
    SelectQueryBuilder<T>
  > {
    const mockQueryBuilder: Partial<SelectQueryBuilder<T>> = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      having: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn(),
      getCount: jest.fn(),
      getRawOne: jest.fn(),
      getRawMany: jest.fn(),
      execute: jest.fn(),
    };
    return mockQueryBuilder as jest.Mocked<SelectQueryBuilder<T>>;
  }

  /**
   * Creates base repository mock with all required methods
   */
  private static createBaseRepositoryMock<T extends ObjectLiteral>(
    entity: any,
  ): jest.Mocked<Repository<T>> {
    const mockRepo: MockRepository<T> = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      findAndCount: jest.fn(),
      findAndCountBy: jest.fn(),
      findOneOrFail: jest.fn(),
      findOneByOrFail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      softRemove: jest.fn(),
      recover: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
      count: jest.fn(),
      countBy: jest.fn(),
      sum: jest.fn(),
      average: jest.fn(),
      minimum: jest.fn(),
      maximum: jest.fn(),
      exists: jest.fn(),
      existsBy: jest.fn(),
      createQueryBuilder: jest
        .fn()
        .mockReturnValue(AuthMockProvider.createMockQueryBuilder<T>()),
      query: jest.fn(),
      clear: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
      preload: jest.fn(),
      merge: jest.fn(),
    };

    // Add required Repository properties
    Object.defineProperty(mockRepo, 'target', { value: entity });
    Object.defineProperty(mockRepo, 'metadata', { value: {} });
    Object.defineProperty(mockRepo, 'manager', { value: {} });
    Object.defineProperty(mockRepo, 'queryRunner', { value: null });

    return mockRepo as jest.Mocked<Repository<T>>;
  }

  /**
   * Creates mock user repository
   */
  static createUserRepository(): jest.Mocked<Repository<User>> {
    return AuthMockProvider.createBaseRepositoryMock<User>(User);
  }

  /**
   * Creates mock role repository
   */
  static createRoleRepository(): jest.Mocked<Repository<Role>> {
    return AuthMockProvider.createBaseRepositoryMock<Role>(Role);
  }

  /**
   * Creates mock auth session repository
   */
  static createAuthSessionRepository(): jest.Mocked<Repository<AuthSession>> {
    return AuthMockProvider.createBaseRepositoryMock<AuthSession>(AuthSession);
  }

  /**
   * Creates mock auth password reset repository
   */
  static createAuthPasswordResetRepository(): jest.Mocked<
    Repository<AuthPasswordReset>
  > {
    return AuthMockProvider.createBaseRepositoryMock<AuthPasswordReset>(
      AuthPasswordReset,
    );
  }

  /**
   * Creates mock data source - simplified to avoid complex DataSource typing
   */
  static createDataSource(): Partial<DataSource> {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        remove: jest.fn(),
      },
    };

    return {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      transaction: jest.fn().mockImplementation(async fn => {
        return await fn(mockQueryRunner.manager);
      }),
      getRepository: jest
        .fn()
        .mockReturnValue(AuthMockProvider.createUserRepository()),
      manager: {
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        remove: jest.fn(),
        transaction: jest.fn(),
      } as unknown as EntityManager,
      isInitialized: true,
      options: {} as DataSourceOptions,
    };
  }

  /**
   * Creates a complete mock setup for auth module testing
   */
  static createCompleteAuthMocks() {
    return {
      authService: AuthMockProvider.createAuthService(),
      authUserService: AuthMockProvider.createAuthUserService(),
      authTokenService: AuthMockProvider.createAuthTokenService(),
      authPasswordService: AuthMockProvider.createAuthPasswordService(),
      authSessionService: AuthMockProvider.createAuthSessionService(),
      authErrorHandler: AuthMockProvider.createAuthErrorHandler(),
      authPasswordResetService:
        AuthMockProvider.createAuthPasswordResetService(),
      notificationService: AuthMockProvider.createNotificationService(),
      jwtService: AuthMockProvider.createJwtService(),
      configService: AuthMockProvider.createConfigService(),
      userRepository: AuthMockProvider.createUserRepository(),
      roleRepository: AuthMockProvider.createRoleRepository(),
      authSessionRepository: AuthMockProvider.createAuthSessionRepository(),
      authPasswordResetRepository:
        AuthMockProvider.createAuthPasswordResetRepository(),
      dataSource: AuthMockProvider.createDataSource(),
    };
  }

  /**
   * Creates mock providers array for NestJS testing modules
   */
  static createMockProviders() {
    const mocks = AuthMockProvider.createCompleteAuthMocks();

    return [
      { provide: AuthService, useValue: mocks.authService },
      { provide: AuthUserService, useValue: mocks.authUserService },
      { provide: AuthTokenService, useValue: mocks.authTokenService },
      { provide: AuthPasswordService, useValue: mocks.authPasswordService },
      { provide: AuthSessionService, useValue: mocks.authSessionService },
      { provide: AuthErrorHandler, useValue: mocks.authErrorHandler },
      {
        provide: AuthPasswordResetService,
        useValue: mocks.authPasswordResetService,
      },
      { provide: NotificationService, useValue: mocks.notificationService },
      { provide: JwtService, useValue: mocks.jwtService },
      { provide: ConfigService, useValue: mocks.configService },
    ];
  }

  /**
   * Creates repository providers for testing modules
   */
  static createRepositoryProviders() {
    const mocks = AuthMockProvider.createCompleteAuthMocks();

    return [
      { provide: 'UserRepository', useValue: mocks.userRepository },
      { provide: 'RoleRepository', useValue: mocks.roleRepository },
      {
        provide: 'AuthSessionRepository',
        useValue: mocks.authSessionRepository,
      },
      {
        provide: 'AuthPasswordResetRepository',
        useValue: mocks.authPasswordResetRepository,
      },
    ];
  }

  /**
   * Creates all providers (services + repositories) for testing modules
   */
  static createAllProviders() {
    return [
      ...AuthMockProvider.createMockProviders(),
      ...AuthMockProvider.createRepositoryProviders(),
    ];
  }
}
