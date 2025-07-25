/**
 * Auth Token Management E2E Tests
 * Tests token refresh and logout functionality
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthTestHelper } from '../utils/auth-test.helper';
import { AuthFixtures } from '../fixtures/auth.fixtures';
import * as request from 'supertest';
import { IAuthTokens } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('Auth Token Management (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');

    // Enable validation globally
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    authHelper = new AuthTestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/refresh - Success Cases', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create user and get refresh token
      const timestamp = Date.now().toString().slice(-6);
      const userData = {
        email: `refresh-${Date.now()}@example.com`,
        username: `refreshuser${timestamp}`,
        password: 'SecurePass123!',
      };

      const response = await authHelper.registerUser(userData);
      refreshToken = response.body.data?.tokens?.refresh_token as string;
    });

    it('should refresh tokens successfully', async () => {
      const response = await authHelper.refreshTokens(refreshToken);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.refresh,
        data: {
          access_token: expect.any(String),
          refresh_token: expect.any(String),
        },
      });

      // Verify tokens are valid JWT format
      authHelper.expectValidJwtToken(
        response.body.data?.access_token as string,
      );
      authHelper.expectValidJwtToken(
        response.body.data?.refresh_token as string,
      );
    });

    it('should refresh tokens multiple times', async () => {
      let currentRefreshToken = refreshToken;

      for (let i = 0; i < 3; i++) {
        const response = await authHelper.refreshTokens(currentRefreshToken);
        expect(response.status).toBe(HttpStatus.CREATED);
        // Note: API doesn't rotate refresh tokens, so they may stay the same
        currentRefreshToken = response.body.data?.refresh_token as string;
      }
    });

    it('should return different access tokens on each refresh', async () => {
      const responses = await Promise.all([
        authHelper.refreshTokens(refreshToken),
        authHelper.refreshTokens(refreshToken),
        authHelper.refreshTokens(refreshToken),
      ]);

      const accessTokens = responses.map(
        r => r.body.data?.access_token as string,
      );
      const uniqueTokens = new Set(accessTokens);

      // Should have different access tokens (API generates unique access tokens)
      expect(uniqueTokens.size).toBeGreaterThan(1);
    });
  });

  describe('POST /api/v1/auth/refresh - Error Cases', () => {
    it('should return 400 for invalid refresh token', async () => {
      const response = await authHelper.refreshTokens('invalid-token');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain(
        'Refresh token must be a valid JWT format',
      );
    });

    it('should return 401 for expired refresh token', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const response = await authHelper.refreshTokens(expiredToken);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain(
        'Invalid or expired refresh token',
      );
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await authHelper.refreshTokens('');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('Refresh token is required');
    });

    it('should return 400 for malformed token', async () => {
      const malformedTokens = [
        'not-a-jwt-token',
        'header.payload', // Missing signature
        'header.payload.signature.extra', // Too many parts
      ];

      for (const token of malformedTokens) {
        const response = await authHelper.refreshTokens(token);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('POST /api/v1/auth/logout - Success Cases', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create user and get access token
      const timestamp = Date.now().toString().slice(-6);
      const userData = {
        email: `logout-${Date.now()}@example.com`,
        username: `logoutuser${timestamp}`,
        password: 'SecurePass123!',
      };

      const response = await authHelper.registerUser(userData);
      accessToken = response.body.data?.tokens?.access_token as string;
    });

    it('should logout successfully with valid token', async () => {
      const response = await authHelper.logoutUser(accessToken);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.logout,
      });
    });

    it('should logout multiple times with same token', async () => {
      // First logout
      const response1 = await authHelper.logoutUser(accessToken);
      expect(response1.status).toBe(HttpStatus.CREATED);

      // Second logout (should fail since token is invalidated)
      const response2 = await authHelper.logoutUser(accessToken);
      expect(response2.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/v1/auth/logout - Error Cases', () => {
    it('should return 401 for missing authorization header', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .expect(401);

      expect(response.body.message).toContain('No valid authorization header');
    });

    it('should return 401 for invalid token format', async () => {
      const response = await authHelper.logoutUser('invalid-token');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should return 401 for expired token', async () => {
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const response = await authHelper.logoutUser(expiredToken);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should return 401 for malformed authorization header', async () => {
      const malformedHeaders = ['Bearer', 'Bearer ', 'Basic token', 'token'];

      for (const header of malformedHeaders) {
        const response = await request(app.getHttpServer())
          .post('/api/v1/auth/logout')
          .set('Authorization', header)
          .expect(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('Token Integration Tests', () => {
    it('should handle complete token lifecycle', async () => {
      // 1. Register and get tokens
      const timestamp = Date.now().toString().slice(-6);
      const userData = {
        email: `lifecycle-${Date.now()}@example.com`,
        username: `lifecycleuser${timestamp}`,
        password: 'SecurePass123!',
      };

      const registerResponse = await authHelper.registerUser(userData);
      const { access_token, refresh_token } = registerResponse.body.data
        ?.tokens as IAuthTokens;

      // 2. Use access token for logout
      const logoutResponse = await authHelper.logoutUser(access_token);
      expect(logoutResponse.status).toBe(HttpStatus.CREATED);

      // 3. Refresh tokens should fail after logout (session invalidated)
      const refreshResponse = await authHelper.refreshTokens(refresh_token);
      expect(refreshResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      // 4. Try to use the old access token for logout (should fail)
      const newLogoutResponse = await authHelper.logoutUser(access_token);
      expect(newLogoutResponse.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should handle concurrent token operations', async () => {
      // 1. Register and get tokens
      const timestamp = Date.now().toString().slice(-6);
      const userData = {
        email: `concurrent-${Date.now()}@example.com`,
        username: `concurrentuser${timestamp}`,
        password: 'SecurePass123!',
      };

      const registerResponse = await authHelper.registerUser(userData);
      const { access_token, refresh_token } = registerResponse.body.data
        ?.tokens as IAuthTokens;

      // Concurrent refresh operations (should all succeed)
      const refreshPromises = [
        authHelper.refreshTokens(refresh_token),
        authHelper.refreshTokens(refresh_token),
        authHelper.refreshTokens(refresh_token),
      ];

      const refreshResponses = await Promise.all(refreshPromises);

      // All refresh operations should complete successfully
      refreshResponses.forEach(response => {
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.success).toBe(true);
      });

      // Concurrent logout operations (first should succeed, others may fail)
      const logoutPromises = [
        authHelper.logoutUser(access_token),
        authHelper.logoutUser(access_token),
        authHelper.logoutUser(access_token),
      ];

      const logoutResponses = await Promise.all(logoutPromises);

      // At least one logout should succeed
      const successfulLogouts = logoutResponses.filter(
        response => response.status === HttpStatus.CREATED,
      );
      expect(successfulLogouts.length).toBeGreaterThan(0);
    });
  });
});
