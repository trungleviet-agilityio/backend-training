// src/auth/__tests__/auth-jwt.strategy.spec.ts
/**
 * JwtAuthStrategy Unit Tests
 *
 * This test suite demonstrates comprehensive unit testing for the JwtAuthStrategy
 * using the Factory, Builder, and Strategy patterns.
 *
 * Test Coverage:
 * - authenticate - User authentication with credentials
 * - register - User registration with data
 * - refreshToken - Token refresh functionality
 * - logout - User logout functionality
 * - validateToken - Token validation functionality
 * - generateTokens - Token generation functionality
 *
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { JwtAuthStrategy } from '../strategies/auth-jwt.strategy';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { AuthSession } from '../../database/entities/auth-session.entity';
import { AuthMapperService } from '../services/auth-mapper.service';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthTestBuilder } from './mocks/auth-test.builder';
import { AuthMockProvider } from './mocks/auth-mock.provider';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('JwtAuthStrategy', () => {
  let strategy: JwtAuthStrategy;
  let userRepository: jest.Mocked<Repository<User>>;
  let roleRepository: jest.Mocked<Repository<Role>>;
  let authSessionRepository: jest.Mocked<Repository<AuthSession>>;
  let jwtService: jest.Mocked<JwtService>;
  let authMapperService: jest.Mocked<AuthMapperService>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    // Create mocks using the Mock Provider (Factory Pattern)
    const mockUserRepository = AuthMockProvider.createUserRepository();
    const mockRoleRepository = AuthMockProvider.createRoleRepository();
    const mockAuthSessionRepository =
      AuthMockProvider.createAuthSessionRepository();
    const mockJwtService = AuthMockProvider.createJwtService();
    const mockAuthMapperService = AuthMockProvider.createAuthMapperService();
    const mockDataSource = {
      createQueryRunner: jest.fn(),
    } as any;

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthStrategy,
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
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'AUTH_MAPPER_SERVICE',
          useValue: mockAuthMapperService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    strategy = moduleRef.get<JwtAuthStrategy>(JwtAuthStrategy);
    userRepository = moduleRef.get(getRepositoryToken(User));
    roleRepository = moduleRef.get(getRepositoryToken(Role));
    authSessionRepository = moduleRef.get(getRepositoryToken(AuthSession));
    jwtService = moduleRef.get(JwtService);
    authMapperService = moduleRef.get<AuthMapperService>(
      'AUTH_MAPPER_SERVICE',
    ) as jest.Mocked<AuthMapperService>;
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(() => {
    // Clean up all mocks after each test
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      // Arrange - Using Builder Pattern for complex scenario setup
      const scenario = new AuthTestBuilder()
        .withUser(TestDataFactory.createUser())
        .withLoginDto(TestDataFactory.createLoginDto())
        .withTokens(TestDataFactory.createAuthTokens())
        .build();

      userRepository.findOne.mockResolvedValue(scenario.user!);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('test-access-token');
      authSessionRepository.save.mockResolvedValue(
        TestDataFactory.createAuthSession(),
      );

      // Act
      const result = await strategy.authenticate(scenario.loginDto!);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: scenario.loginDto!.email },
          { username: scenario.loginDto!.email },
        ],
        relations: ['role'],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        scenario.loginDto!.password,
        scenario.user!.passwordHash,
      );
      expect(result).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto();
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.authenticate(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOne).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto();
      const inactiveUser = TestDataFactory.createUser({ isActive: false });
      userRepository.findOne.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(strategy.authenticate(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Arrange
      const loginDto = TestDataFactory.createLoginDto();
      const user = TestDataFactory.createUser();
      userRepository.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(strategy.authenticate(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.passwordHash,
      );
    });
  });

  describe('register', () => {
    it('should register user successfully with valid data', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterDto();
      const defaultRole = TestDataFactory.createRole({ name: 'user' });
      const newUser = TestDataFactory.createUser({
        email: registerDto.email,
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });

      // Mock repository calls in the correct order
      userRepository.findOne
        .mockResolvedValueOnce(null) // First call: check if user exists (should return null)
        .mockResolvedValueOnce(newUser); // Second call: load user with role

      roleRepository.findOne.mockResolvedValue(defaultRole);
      mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);
      jwtService.sign.mockReturnValue('test-access-token');
      authSessionRepository.save.mockResolvedValue(
        TestDataFactory.createAuthSession(),
      );

      // Act
      const result = await strategy.register(registerDto);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: registerDto.email },
          { username: registerDto.username },
        ],
      });
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'user' },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(result).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterDto();
      const existingUser = TestDataFactory.createUser();
      userRepository.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(strategy.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw Error when default role not found', async () => {
      // Arrange
      const registerDto = TestDataFactory.createRegisterDto();
      userRepository.findOne.mockResolvedValue(null); // No existing user
      roleRepository.findOne.mockResolvedValue(null); // No default role

      // Act & Assert
      await expect(strategy.register(registerDto)).rejects.toThrow(
        'Default role not found',
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const session = TestDataFactory.createAuthSession();
      const expectedTokens = TestDataFactory.createRefreshTokenResponse();

      jwtService.verify.mockReturnValue({ sessionId: session.uuid });
      authSessionRepository.findOne.mockResolvedValue(session);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('new-access-token');
      authSessionRepository.update.mockResolvedValue({ affected: 1 } as never);

      // Act
      const result = await strategy.refreshToken(refreshToken);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(authSessionRepository.findOne).toHaveBeenCalledWith({
        where: {
          uuid: session.uuid,
          isActive: true,
        },
        relations: ['user', 'user.role'],
      });
      expect(result).toBeDefined();
      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(strategy.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired session', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const expiredSession = TestDataFactory.createAuthSession({
        expiresAt: new Date(Date.now() - 1000), // Expired
      });

      jwtService.verify.mockReturnValue({ sessionId: expiredSession.uuid });
      authSessionRepository.findOne.mockResolvedValue(expiredSession);

      // Act & Assert
      await expect(strategy.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Arrange
      const sessionId = 'test-session-id';
      authSessionRepository.update.mockResolvedValue({ affected: 1 } as never);

      // Act
      await strategy.logout(sessionId);

      // Assert
      expect(authSessionRepository.update).toHaveBeenCalledWith(sessionId, {
        isActive: false,
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully with valid token', async () => {
      // Arrange
      const token = 'valid-token';
      const user = TestDataFactory.createUser();
      const payload = { sub: user.uuid };

      jwtService.verify.mockReturnValue(payload);
      userRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await strategy.validateToken(token);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: payload.sub },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const token = 'invalid-token';
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(strategy.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      // Arrange
      const token = 'valid-token';
      const inactiveUser = TestDataFactory.createUser({ isActive: false });
      const payload = { sub: inactiveUser.uuid };

      jwtService.verify.mockReturnValue(payload);
      userRepository.findOne.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(strategy.validateToken(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
