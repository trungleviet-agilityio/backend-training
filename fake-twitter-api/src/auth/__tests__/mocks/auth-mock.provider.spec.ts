/**
 * AuthMockProvider Unit Tests
 */

import { AuthMockProvider } from './auth-mock.provider';
import { AuthService } from '../../services/auth.service';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthTokenService } from '../../services/auth-token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthMockProvider', () => {
  describe('Service Mocks', () => {
    it('should create auth service mock with all required methods', () => {
      const mockService = AuthMockProvider.createAuthService();

      expect(mockService).toBeDefined();
      expect(mockService.login).toBeDefined();
      expect(mockService.register).toBeDefined();
      expect(mockService.refresh).toBeDefined();
      expect(mockService.logout).toBeDefined();
      expect(mockService.forgotPassword).toBeDefined();
      expect(mockService.resetPassword).toBeDefined();

      expect(jest.isMockFunction(mockService.login)).toBe(true);
      expect(jest.isMockFunction(mockService.register)).toBe(true);
    });

    it('should create auth user service mock with all required methods', () => {
      const mockService = AuthMockProvider.createAuthUserService();

      expect(mockService).toBeDefined();
      expect(mockService.validateCredentials).toBeDefined();
      expect(mockService.createUser).toBeDefined();
      expect(mockService.findByEmail).toBeDefined();
      expect(mockService.updatePassword).toBeDefined();

      expect(jest.isMockFunction(mockService.validateCredentials)).toBe(true);
      expect(jest.isMockFunction(mockService.createUser)).toBe(true);
    });

    it('should create auth token service mock with all required methods', () => {
      const mockService = AuthMockProvider.createAuthTokenService();

      expect(mockService).toBeDefined();
      expect(mockService.generateTokens).toBeDefined();
      expect(mockService.validateRefreshToken).toBeDefined();

      expect(jest.isMockFunction(mockService.generateTokens)).toBe(true);
      expect(jest.isMockFunction(mockService.validateRefreshToken)).toBe(true);
    });
  });

  describe('External Service Mocks', () => {
    it('should create JWT service mock with all required methods', () => {
      const mockService = AuthMockProvider.createJwtService();

      expect(mockService).toBeDefined();
      expect(mockService.sign).toBeDefined();
      expect(mockService.verify).toBeDefined();
      expect(mockService.decode).toBeDefined();

      expect(jest.isMockFunction(mockService.sign)).toBe(true);
      expect(jest.isMockFunction(mockService.verify)).toBe(true);
    });

    it('should create config service mock with proper implementation', () => {
      const mockService = AuthMockProvider.createConfigService();

      expect(mockService).toBeDefined();
      expect(mockService.get).toBeDefined();
      expect(mockService.getOrThrow).toBeDefined();

      // Test actual mock implementation
      expect(mockService.get('JWT_SECRET')).toBe('test-jwt-secret');
      expect(mockService.getOrThrow('JWT_SECRET')).toBe('test-jwt-secret');
      expect(() => mockService.getOrThrow('NON_EXISTENT_KEY')).toThrow();
    });
  });

  describe('Repository Mocks', () => {
    it('should create user repository mock with all required methods', () => {
      const mockRepo = AuthMockProvider.createUserRepository();

      expect(mockRepo).toBeDefined();
      expect(mockRepo.find).toBeDefined();
      expect(mockRepo.findOne).toBeDefined();
      expect(mockRepo.create).toBeDefined();
      expect(mockRepo.save).toBeDefined();
      expect(mockRepo.update).toBeDefined();
      expect(mockRepo.delete).toBeDefined();

      expect(jest.isMockFunction(mockRepo.find)).toBe(true);
      expect(jest.isMockFunction(mockRepo.findOne)).toBe(true);
    });
  });

  describe('Helper Methods', () => {
    it('should create complete auth mocks object', () => {
      const mocks = AuthMockProvider.createCompleteAuthMocks();

      expect(mocks).toBeDefined();
      expect(mocks.authService).toBeDefined();
      expect(mocks.authUserService).toBeDefined();
      expect(mocks.authTokenService).toBeDefined();
      expect(mocks.jwtService).toBeDefined();
      expect(mocks.configService).toBeDefined();
      expect(mocks.userRepository).toBeDefined();
    });

    it('should create mock providers array', () => {
      const providers = AuthMockProvider.createMockProviders();

      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);

      const authServiceProvider = providers.find(
        p => p.provide === AuthService,
      );
      expect(authServiceProvider).toBeDefined();
      expect(authServiceProvider?.useValue).toBeDefined();
    });
  });
});
