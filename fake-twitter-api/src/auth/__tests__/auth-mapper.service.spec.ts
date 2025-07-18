/**
 * AuthMapperService Unit Tests
 *
 * This file contains unit tests for the AuthMapperService class.
 * It tests the mapping of user and token data.
 *
 * Test Coverage:
 * - mapToAuthTokensWithUser - Maps user and token data
 * - mapToAuthRefreshToken - Maps refresh token data
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthMapperService } from '../services/auth-mapper.service';
import { TestDataFactory } from '../../common/__tests__/test-utils';
import { AuthRefreshTokenDto } from '../dto';

describe('AuthMapperService', () => {
  let service: AuthMapperService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AuthMapperService],
    }).compile();

    service = moduleRef.get<AuthMapperService>(AuthMapperService);
  });

  describe('mapToAuthTokensWithUser', () => {
    it('should map user and tokens correctly', () => {
      // Arrange
      const user = TestDataFactory.createUser();
      const accessToken = 'test-access-token';
      const refreshToken = 'test-refresh-token';

      // Act
      const result = service.mapToAuthTokensWithUser(user, {
        access_token: accessToken,
        refresh_token: refreshToken,
      } as AuthRefreshTokenDto);

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
            name: user.role?.name || 'user',
          },
        },
      });
    });
  });

  describe('mapToAuthRefreshToken', () => {
    it('should map refresh tokens correctly', () => {
      // Arrange
      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';

      // Act
      const result = service.mapToAuthRefreshToken({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      // Assert
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    });
  });
});
