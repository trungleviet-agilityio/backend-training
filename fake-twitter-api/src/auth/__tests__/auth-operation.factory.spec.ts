/**
 * AuthOperationFactory Unit Tests
 *
 * This file contains unit tests for the AuthOperationFactory class.
 * It tests the creation of different authentication strategies.
 *
 * Test Coverage:
 * - createStrategy - Creates different authentication strategies
 * - JWT strategy - Creates JWT strategy
 * - AUTH0 strategy - Not implemented yet
 * - Error handling - Throws errors for unsupported providers
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthOperationFactory,
  AuthProvider,
} from '../factories/auth-operation.factory';
import { JwtAuthStrategy } from '../strategies/auth-jwt.strategy';
import { AuthMockProvider } from './mocks/auth-mock.provider';

describe('AuthOperationFactory', () => {
  let factory: AuthOperationFactory;
  let jwtStrategy: jest.Mocked<JwtAuthStrategy>;

  beforeEach(async () => {
    const mockJwtStrategy = AuthMockProvider.createAuthStrategy();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthOperationFactory,
        {
          provide: 'JWT_AUTH_STRATEGY',
          useValue: mockJwtStrategy,
        },
      ],
    }).compile();

    factory = moduleRef.get<AuthOperationFactory>(AuthOperationFactory);
    jwtStrategy = moduleRef.get<JwtAuthStrategy>(
      'JWT_AUTH_STRATEGY',
    ) as jest.Mocked<JwtAuthStrategy>;
  });

  describe('createStrategy', () => {
    it('should create JWT strategy by default', () => {
      // Act
      const strategy = factory.createStrategy();

      // Assert
      expect(strategy).toBe(jwtStrategy);
    });

    it('should create JWT strategy when JWT provider is specified', () => {
      // Act
      const strategy = factory.createStrategy(AuthProvider.JWT);

      // Assert
      expect(strategy).toBe(jwtStrategy);
    });

    it('should throw error for AUTH0 provider (not implemented)', () => {
      // Act & Assert
      expect(() => factory.createStrategy(AuthProvider.AUTH0)).toThrow(
        'Auth0 strategy not implemented yet',
      );
    });

    it('should return JWT strategy for unknown provider (fallback)', () => {
      // Act
      const strategy = factory.createStrategy('unknown' as AuthProvider);

      // Assert
      expect(strategy).toBe(jwtStrategy);
    });
  });
});
