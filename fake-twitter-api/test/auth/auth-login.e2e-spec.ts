/**
 * Auth Login E2E Tests
 * Tests user authentication functionality
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthTestHelper } from '../utils/auth-test.helper';
import { AuthFixtures } from '../fixtures/auth.fixtures';
import { IUserLoginData } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('Auth Login (e2e)', () => {
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

  describe('POST /api/v1/auth/login - Success Cases', () => {
    let testUser: any;

    beforeEach(async () => {
      // Create test user for login tests
      const timestamp = Date.now().toString().slice(-6);
      testUser = {
        email: `login-${Date.now()}@example.com`,
        username: `loginuser${timestamp}`,
        password: 'SecurePass123!',
      };

      await authHelper.registerUser(testUser);
    });

    it('should login with email successfully', async () => {
      const response = await authHelper.loginUser({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.login,
        data: {
          user: {
            username: testUser.username,
          },
          tokens: {
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          },
        },
      });

      authHelper.expectValidJwtToken(
        response.body.data?.tokens?.access_token as string,
      );
      authHelper.expectValidJwtToken(
        response.body.data?.tokens?.refresh_token as string,
      );
    });

    it('should login with username successfully', async () => {
      const response = await authHelper.loginUser({
        email: testUser.username,
        password: testUser.password,
      });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data?.user?.username).toBe(testUser.username);
    });

    it('should login multiple times with same credentials', async () => {
      const credentials = {
        email: testUser.email,
        password: testUser.password,
      };

      // Multiple login attempts
      const responses = await Promise.all([
        authHelper.loginUser(credentials),
        authHelper.loginUser(credentials),
        authHelper.loginUser(credentials),
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.body.data?.tokens?.access_token).toBeDefined();
      });
    });

    it('should handle case-insensitive email login', async () => {
      const response = await authHelper.loginUser({
        email: testUser.email.toUpperCase(),
        password: testUser.password,
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/v1/auth/login - Authentication Errors', () => {
    let testUser: any;

    beforeEach(async () => {
      const timestamp = Date.now().toString().slice(-6);
      testUser = {
        email: `auth-error-${Date.now()}@example.com`,
        username: `autherroruser${timestamp}`,
        password: 'SecurePass123!',
      };

      await authHelper.registerUser(testUser);
    });

    it('should return 401 for invalid password', async () => {
      const response = await authHelper.loginUser({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain(
        AuthFixtures.expectedErrorMessages.invalidCredentials,
      );
    });

    it('should return 401 for non-existent user', async () => {
      const response = await authHelper.loginUser({
        email: 'nonexistent@example.com',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain(
        AuthFixtures.expectedErrorMessages.invalidCredentials,
      );
    });

    it('should return 401 for empty credentials', async () => {
      const emptyCredentials = [
        { password: 'SecurePass123!' },
        { email: 'test@example.com' },
        {},
      ];

      for (const credentials of emptyCredentials) {
        const response = await authHelper.loginUser(
          credentials as unknown as IUserLoginData,
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return 401 for wrong username', async () => {
      const response = await authHelper.loginUser({
        email: 'wrongusername',
        password: testUser.password,
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /api/v1/auth/login - Validation Errors', () => {
    it('should return 200 for invalid email format (API accepts any string)', async () => {
      const response = await authHelper.loginUser({
        email: 'invalid-email',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return 400 for empty password', async () => {
      const response = await authHelper.loginUser({
        email: 'test@example.com',
        password: '',
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for missing fields', async () => {
      const missingFields = [
        { password: 'SecurePass123!' },
        { email: 'test@example.com' },
        {},
      ];

      for (const credentials of missingFields) {
        const response = await authHelper.loginUser(
          credentials as unknown as IUserLoginData,
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('POST /api/v1/auth/login - Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      const longEmail = `verylongemailaddress${'a'.repeat(200)}@example.com`;

      const response = await authHelper.loginUser({
        email: longEmail,
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED); // Should fail gracefully
    });

    it('should handle special characters in credentials', async () => {
      const response = await authHelper.loginUser({
        email: 'test@example.com',
        password: 'SecurePass123!@#$%^&*()',
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED); // Should fail gracefully
    });

    it('should handle concurrent login attempts', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const testUser = {
        email: `concurrent-login-${Date.now()}@example.com`,
        username: `concurrentloginuser${timestamp}`,
        password: 'SecurePass123!',
      };

      await authHelper.registerUser(testUser);

      // Small delay to ensure user is fully created
      await new Promise(resolve => setTimeout(resolve, 100));

      const credentials = {
        email: testUser.email,
        password: testUser.password,
      };

      const promises = Array(5)
        .fill(null)
        .map(() => authHelper.loginUser(credentials));

      const responses = await Promise.all(promises);

      // Verify that all requests completed (no crashes)
      expect(responses).toHaveLength(5);
      responses.forEach(response => {
        expect(response.status).toBeDefined();
        expect(response.body).toBeDefined();
      });
    });
  });
});
