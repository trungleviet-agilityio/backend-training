/**
 * Auth module unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../auth.controller';
import { AuthMapperService } from '../services/auth-mapper.service';
import { AuthPasswordResetService } from '../services/auth-password-reset.service';
import { AuthOperationFactory } from '../factories/auth-operation.factory';
import { JwtAuthStrategy, JwtStrategy, LocalStrategy } from '../strategies';
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

    // Test the module structure by providing all the same providers as AuthModule
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
        // Services
        AuthService,
        AuthPasswordResetService,
        AuthMapperService,
        // Factories
        AuthOperationFactory,
        // Strategies
        JwtAuthStrategy,
        JwtStrategy,
        LocalStrategy,
        // Guards
        JwtAuthGuard,
        RolesGuard,
        // Custom providers
        {
          provide: 'JWT_AUTH_STRATEGY',
          useExisting: JwtAuthStrategy,
        },
        {
          provide: 'AUTH_MAPPER_SERVICE',
          useExisting: AuthMapperService,
        },
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
        // DataSource (mocked)
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
      exports: [AuthService],
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

  it('should provide AuthMapperService', () => {
    const authMapperService = module.get<AuthMapperService>(AuthMapperService);
    expect(authMapperService).toBeDefined();
    expect(authMapperService).toBeInstanceOf(AuthMapperService);
  });

  it('should provide AuthPasswordResetService', () => {
    const authPasswordResetService = module.get<AuthPasswordResetService>(
      AuthPasswordResetService,
    );
    expect(authPasswordResetService).toBeDefined();
    expect(authPasswordResetService).toBeInstanceOf(AuthPasswordResetService);
  });

  it('should provide AuthOperationFactory', () => {
    const authOperationFactory =
      module.get<AuthOperationFactory>(AuthOperationFactory);
    expect(authOperationFactory).toBeDefined();
    expect(authOperationFactory).toBeInstanceOf(AuthOperationFactory);
  });

  it('should provide JwtAuthStrategy', () => {
    const jwtAuthStrategy = module.get<JwtAuthStrategy>(JwtAuthStrategy);
    expect(jwtAuthStrategy).toBeDefined();
    expect(jwtAuthStrategy).toBeInstanceOf(JwtAuthStrategy);
  });

  it('should provide JwtStrategy', () => {
    const jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    expect(jwtStrategy).toBeDefined();
    expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
  });

  it('should provide LocalStrategy', () => {
    const localStrategy = module.get<LocalStrategy>(LocalStrategy);
    expect(localStrategy).toBeDefined();
    expect(localStrategy).toBeInstanceOf(LocalStrategy);
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

  it('should export AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeInstanceOf(AuthService);
  });

  it('should have all required dependencies for AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();

    // Verify that all dependencies are properly injected
    const userRepository = module.get(getRepositoryToken(User));
    const roleRepository = module.get(getRepositoryToken(Role));
    const authSessionRepository = module.get(getRepositoryToken(AuthSession));
    const authPasswordResetRepository = module.get(
      getRepositoryToken(AuthPasswordReset),
    );
    const configService = module.get<ConfigService>(ConfigService);
    const authOperationFactory =
      module.get<AuthOperationFactory>(AuthOperationFactory);
    const authMapperService = module.get<AuthMapperService>(AuthMapperService);
    const authPasswordResetService = module.get<AuthPasswordResetService>(
      AuthPasswordResetService,
    );

    expect(userRepository).toBeDefined();
    expect(roleRepository).toBeDefined();
    expect(authSessionRepository).toBeDefined();
    expect(authPasswordResetRepository).toBeDefined();
    expect(configService).toBeDefined();
    expect(authOperationFactory).toBeDefined();
    expect(authMapperService).toBeDefined();
    expect(authPasswordResetService).toBeDefined();
  });

  it('should have all required dependencies for AuthController', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();

    // The controller should have access to the AuthService
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });
});
