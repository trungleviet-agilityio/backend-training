/**
 * Auth Mock Provider - Factory Pattern Implementation
 *
 * This provider creates consistent mocks for auth-related services
 * and repositories, ensuring all tests use the same mock structure.
 */

import { Repository, ObjectLiteral, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../database/entities/user.entity';
import { Role } from '../../../database/entities/role.entity';
import { AuthSession } from '../../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../../database/entities/auth-password-reset.entity';
import { AuthService } from '../../services/auth.service';
import { AuthOperationFactory } from '../../factories/auth-operation.factory';
import { AuthPasswordResetService } from '../../services/auth-password-reset.service';
import { AuthMapperService } from '../../services/auth-mapper.service';
import { NotificationService } from '../../../notifications/services/notification.service';
import { IAuthOperationStrategy } from '../../strategies/auth-operation.strategy';

export class AuthMockProvider {
  /**
   * Creates a mock auth service
   */
  static createAuthService(): jest.Mocked<Partial<AuthService>> {
    return {
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      validateUser: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as jest.Mocked<Partial<AuthService>>;
  }

  /**
   * Creates a mock auth operation factory
   */
  static createAuthOperationFactory(): jest.Mocked<Partial<AuthOperationFactory>> {
    return {
      createStrategy: jest.fn(),
    } as jest.Mocked<Partial<AuthOperationFactory>>;
  }

  /**
   * Creates a mock auth password reset service
   */
  static createAuthPasswordResetService(): jest.Mocked<Partial<AuthPasswordResetService>> {
    return {
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as jest.Mocked<Partial<AuthPasswordResetService>>;
  }

  /**
   * Creates a standardized mock repository with common methods
   */
  private static createBaseRepository<T extends ObjectLiteral>(): jest.Mocked<Partial<Repository<T>>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
        getManyAndCount: jest.fn(),
        getRawOne: jest.fn(),
        getRawMany: jest.fn(),
        execute: jest.fn(),
      } as any)),
    } as jest.Mocked<Partial<Repository<T>>>;
  }

  /**
   * Creates a mock user repository
   */
  static createUserRepository(): jest.Mocked<Partial<Repository<User>>> {
    return this.createBaseRepository<User>();
  }

  /**
   * Creates a mock role repository
   */
  static createRoleRepository(): jest.Mocked<Partial<Repository<Role>>> {
    return this.createBaseRepository<Role>();
  }

  /**
   * Creates a mock auth session repository
   */
  static createAuthSessionRepository(): jest.Mocked<Partial<Repository<AuthSession>>> {
    return this.createBaseRepository<AuthSession>();
  }

  /**
   * Creates a mock auth password reset repository
   */
  static createAuthPasswordResetRepository(): jest.Mocked<Partial<Repository<AuthPasswordReset>>> {
    return this.createBaseRepository<AuthPasswordReset>();
  }

  /**
   * Creates a mock JWT service
   */
  static createJwtService(): jest.Mocked<Partial<JwtService>> {
    return {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as jest.Mocked<Partial<JwtService>>;
  }

  /**
   * Creates a mock auth mapper service
   */
  static createAuthMapperService(): jest.Mocked<Partial<AuthMapperService>> {
    return {
      mapToAuthTokensWithUser: jest.fn(),
      mapToAuthRefreshToken: jest.fn(),
    } as jest.Mocked<Partial<AuthMapperService>>;
  }

  /**
   * Creates a mock notification service
   */
  static createNotificationService(): jest.Mocked<NotificationService> {
    return {
      sendPasswordResetEmail: jest.fn(),
      sendPasswordResetSuccessEmail: jest.fn(),
      sendWelcomeEmail: jest.fn(),
    } as unknown as jest.Mocked<NotificationService>;
  }

  /**
   * Creates a mock auth strategy
   */
  static createAuthStrategy(): jest.Mocked<IAuthOperationStrategy> {
    return {
      authenticate: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      validateToken: jest.fn(),
    } as jest.Mocked<IAuthOperationStrategy>;
  }

  /**
   * Creates a mock config service
   */
  static createConfigService(): jest.Mocked<Partial<ConfigService>> {
    return {
      get: jest.fn(),
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
    } as jest.Mocked<Partial<ConfigService>>;
  }

  /**
   * Creates a mock data source
   */
  static createDataSource(): jest.Mocked<Partial<DataSource>> {
    return {
      createQueryRunner: jest.fn(),
      createEntityManager: jest.fn(),
      getRepository: jest.fn(),
      transaction: jest.fn(),
      query: jest.fn(),
      manager: {} as any,
    } as jest.Mocked<Partial<DataSource>>;
  }
}
