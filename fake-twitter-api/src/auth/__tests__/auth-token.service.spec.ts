/**
 * AuthTokenService Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthTokenService } from '../services';
import { AuthSession } from '../../database/entities/auth-session.entity';
import { AuthMockProvider } from './mocks/auth-mock.provider';
import { TestDataFactory } from '../../common/__tests__/test-utils';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let jwtService: jest.Mocked<JwtService>;
  let sessionRepository: jest.Mocked<any>;

  beforeEach(async () => {
    const mockJwtService = AuthMockProvider.createJwtService();
    const mockSessionRepository =
      AuthMockProvider.createAuthSessionRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(AuthSession),
          useValue: mockSessionRepository,
        },
      ],
    }).compile();

    service = module.get<AuthTokenService>(AuthTokenService);
    jwtService = module.get(JwtService);
    sessionRepository = module.get(getRepositoryToken(AuthSession));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    it('should generate tokens with new session', async () => {
      // Arrange
      const user = TestDataFactory.createUser();
      const session = TestDataFactory.createAuthSession();
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      sessionRepository.create.mockReturnValue(session);
      sessionRepository.save.mockResolvedValue(session);
      sessionRepository.update.mockResolvedValue({ affected: 1 });
      jwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      mockedBcrypt.hash.mockResolvedValue('hashed-refresh-token' as never);

      // Act
      const result = await service.generateTokens(user);

      // Assert
      expect(result).toEqual({
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        user: {
          uuid: user.uuid,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: {
            name: user.role.name,
          },
        },
      });
      expect(sessionRepository.create).toHaveBeenCalled();
      expect(sessionRepository.save).toHaveBeenCalled();
      expect(sessionRepository.update).toHaveBeenCalled();
    });

    it('should generate tokens with existing session', async () => {
      // Arrange
      const user = TestDataFactory.createUser();
      const sessionId = 'existing-session-id';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      sessionRepository.update.mockResolvedValue({ affected: 1 });
      jwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      mockedBcrypt.hash.mockResolvedValue('hashed-refresh-token' as never);

      // Act
      const result = await service.generateTokens(user, sessionId);

      // Assert
      expect(result.tokens.access_token).toBe(accessToken);
      expect(result.tokens.refresh_token).toBe(refreshToken);
      expect(sessionRepository.create).not.toHaveBeenCalled();
      expect(sessionRepository.update).toHaveBeenCalledWith(
        sessionId,
        expect.any(Object),
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token successfully', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const payload = {
        sub: 'user-uuid',
        type: 'refresh',
        sessionId: 'session-id',
      };
      const session = TestDataFactory.createAuthSession();
      const user = TestDataFactory.createUser();
      session.user = user;

      jwtService.verify.mockReturnValue(payload);
      sessionRepository.findOne.mockResolvedValue(session);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Act
      const result = await service.validateRefreshToken(refreshToken);

      // Assert
      expect(result).toEqual({
        user: session.user,
        sessionId: session.uuid,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      // Arrange
      const refreshToken = 'invalid-token';
      const payload = {
        sub: 'user-uuid',
        type: 'access',
        sessionId: 'session-id',
      };

      jwtService.verify.mockReturnValue(payload);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired session', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const payload = {
        sub: 'user-uuid',
        type: 'refresh',
        sessionId: 'session-id',
      };
      const expiredSession = TestDataFactory.createAuthSession({
        expiresAt: new Date(Date.now() - 1000), // Expired
      });

      jwtService.verify.mockReturnValue(payload);
      sessionRepository.findOne.mockResolvedValue(expiredSession);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid refresh token hash', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token';
      const payload = {
        sub: 'user-uuid',
        type: 'refresh',
        sessionId: 'session-id',
      };
      const session = TestDataFactory.createAuthSession();

      jwtService.verify.mockReturnValue(payload);
      sessionRepository.findOne.mockResolvedValue(session);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.validateRefreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
