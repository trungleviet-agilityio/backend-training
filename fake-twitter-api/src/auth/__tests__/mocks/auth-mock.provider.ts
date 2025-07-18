/**
 * Auth Mock Provider - Factory Pattern Implementation
 *
 * This provider creates consistent mocks for auth-related services
 * and repositories, ensuring all tests use the same mock structure.
 */

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
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
  static createAuthService(): jest.Mocked<AuthService> {
    return {
      login: jest.fn(),
      register: jest.fn(),
      refresh: jest.fn(),
      logout: jest.fn(),
      validateUser: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
  }

  /**
   * Creates a mock auth operation factory
   */
  static createAuthOperationFactory(): jest.Mocked<AuthOperationFactory> {
    return {
      createStrategy: jest.fn(),
    } as unknown as jest.Mocked<AuthOperationFactory>;
  }

  /**
   * Creates a mock auth password reset service
   */
  static createAuthPasswordResetService(): jest.Mocked<AuthPasswordResetService> {
    return {
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthPasswordResetService>;
  }

  /**
   * Creates a mock user repository
   */
  static createUserRepository(): jest.Mocked<Repository<User>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getMany: jest.fn(),
      })),
    } as any;
  }

  /**
   * Creates a mock role repository
   */
  static createRoleRepository(): jest.Mocked<Repository<Role>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  }

  /**
   * Creates a mock auth session repository
   */
  static createAuthSessionRepository(): jest.Mocked<Repository<AuthSession>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  }

  /**
   * Creates a mock auth password reset repository
   */
  static createAuthPasswordResetRepository(): jest.Mocked<
    Repository<AuthPasswordReset>
  > {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  }

  /**
   * Creates a mock JWT service
   */
  static createJwtService(): jest.Mocked<JwtService> {
    return {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;
  }

  /**
   * Creates a mock auth mapper service
   */
  static createAuthMapperService(): jest.Mocked<AuthMapperService> {
    return {
      mapToAuthTokensWithUser: jest.fn(),
      mapToAuthRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthMapperService>;
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

  static createAuthStrategy(): jest.Mocked<IAuthOperationStrategy> {
    return {
      authenticate: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
      validateToken: jest.fn(),
    } as jest.Mocked<IAuthOperationStrategy>;
  }
}
