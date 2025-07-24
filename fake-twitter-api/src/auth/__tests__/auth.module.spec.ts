/**
 * Auth module unit tests - Updated for new service architecture
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../auth.controller';
import {
  AuthService,
  AuthUserService,
  AuthTokenService,
  AuthPasswordService,
  AuthSessionService,
  AuthErrorHandler,
  AuthPasswordResetService,
} from '../services';
import { JwtStrategy } from '../strategies';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { NotificationModule } from '../../notifications/notification.module';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { AuthSession } from '../../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../../database/entities/auth-password-reset.entity';
import { AuthMockProvider } from './mocks/auth-mock.provider';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockConfigService = AuthMockProvider.createConfigService();
    const mockUserRepository = AuthMockProvider.createUserRepository();
    const mockRoleRepository = AuthMockProvider.createRoleRepository();
    const mockAuthSessionRepository =
      AuthMockProvider.createAuthSessionRepository();
    const mockAuthPasswordResetRepository =
      AuthMockProvider.createAuthPasswordResetRepository();
    const mockDataSource = AuthMockProvider.createDataSource();

    module = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-jwt-secret',
          signOptions: {
            expiresIn: '15m',
            algorithm: 'HS256',
          },
        }),
        NotificationModule,
      ],
      controllers: [AuthController],
      providers: [
        // New service architecture
        AuthService,
        AuthUserService,
        AuthTokenService,
        AuthPasswordService,
        AuthSessionService,
        AuthErrorHandler,
        AuthPasswordResetService,

        // Essential Passport strategy
        JwtStrategy,

        // Guards
        JwtAuthGuard,
        RolesGuard,

        // Repositories (mocked)
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(AuthSession),
          useValue: mockAuthSessionRepository,
        },
        {
          provide: getRepositoryToken(AuthPasswordReset),
          useValue: mockAuthPasswordResetRepository,
        },
        // ConfigService (mocked)
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should provide AuthController', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
    expect(authController).toBeInstanceOf(AuthController);
  });

  it('should provide AuthUserService', () => {
    const authUserService = module.get<AuthUserService>(AuthUserService);
    expect(authUserService).toBeDefined();
    expect(authUserService).toBeInstanceOf(AuthUserService);
  });

  it('should provide AuthTokenService', () => {
    const authTokenService = module.get<AuthTokenService>(AuthTokenService);
    expect(authTokenService).toBeDefined();
    expect(authTokenService).toBeInstanceOf(AuthTokenService);
  });

  it('should provide AuthPasswordService', () => {
    const authPasswordService =
      module.get<AuthPasswordService>(AuthPasswordService);
    expect(authPasswordService).toBeDefined();
    expect(authPasswordService).toBeInstanceOf(AuthPasswordService);
  });

  it('should provide AuthSessionService', () => {
    const authSessionService =
      module.get<AuthSessionService>(AuthSessionService);
    expect(authSessionService).toBeDefined();
    expect(authSessionService).toBeInstanceOf(AuthSessionService);
  });

  it('should provide AuthErrorHandler', () => {
    const authErrorHandler = module.get<AuthErrorHandler>(AuthErrorHandler);
    expect(authErrorHandler).toBeDefined();
    expect(authErrorHandler).toBeInstanceOf(AuthErrorHandler);
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
    expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
  });

  it('should provide JwtAuthGuard', () => {
    const jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
    expect(jwtAuthGuard).toBeDefined();
    expect(jwtAuthGuard).toBeInstanceOf(JwtAuthGuard);
  });

  it('should provide RolesGuard', () => {
    const rolesGuard = module.get<RolesGuard>(RolesGuard);
    expect(rolesGuard).toBeDefined();
    expect(rolesGuard).toBeInstanceOf(RolesGuard);
  });
});
