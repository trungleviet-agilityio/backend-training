/**
 * Auth Password Reset E2E Tests
 * Tests password reset functionality
 */

import {
  HttpStatus,
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { AuthTestHelper } from '../utils/auth-test.helper';
import { AuthFixtures } from '../fixtures/auth.fixtures';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

// Custom validation pipe that throws UnprocessableEntityException
class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: errors => {
        return new UnprocessableEntityException({
          message: 'Validation failed',
          errors: errors.map(error => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      },
    });
  }
}

describe('Auth Password Reset (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');

    // Enable validation globally with custom pipe
    app.useGlobalPipes(new CustomValidationPipe());

    await app.init();
    authHelper = new AuthTestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/forgot-password - Success Cases', () => {
    beforeEach(async () => {
      // Create test user
      const userData = {
        email: `forgot-${Date.now()}@example.com`,
        username: `forgotuser-${Date.now()}`,
        password: 'SecurePass123!',
      };

      await authHelper.registerUser(userData);
    });

    it('should send password reset email for existing user', async () => {
      const email = `forgot-${Date.now()}@example.com`;
      const response = await authHelper.requestPasswordReset(email);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.forgotPassword,
      });
    });

    it('should return success for non-existent email (security)', async () => {
      const response = await authHelper.requestPasswordReset(
        'nonexistent@example.com',
      );

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.forgotPassword,
      });
    });

    it('should handle multiple reset requests for same email', async () => {
      const email = `multiple-reset-${Date.now()}@example.com`;

      // Create user
      await authHelper.registerUser({
        email,
        username: `multiresetuser-${Date.now()}`,
        password: 'SecurePass123!',
      });

      // Multiple reset requests
      const responses = await Promise.all([
        authHelper.requestPasswordReset(email),
        authHelper.requestPasswordReset(email),
        authHelper.requestPasswordReset(email),
      ]);

      responses.forEach(response => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });
    });
  });

  describe('POST /api/v1/auth/forgot-password - Validation Errors', () => {
    it('should return 422 for invalid email format', async () => {
      const response = await authHelper.requestPasswordReset('invalid-email');

      expect(response.status).toBe(422);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should return 422 for missing email', async () => {
      const response = await authHelper.requestPasswordReset('');

      expect(response.status).toBe(422);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should return 422 for empty email', async () => {
      const response = await authHelper.requestPasswordReset('   ');
      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/v1/auth/reset-password - Success Cases', () => {
    let resetToken: string;

    beforeEach(async () => {
      // Create user and trigger password reset
      const userData = {
        email: `reset-${Date.now()}@example.com`,
        username: `resetuser-${Date.now()}`,
        password: 'SecurePass123!',
      };

      await authHelper.registerUser(userData);
      await authHelper.requestPasswordReset(userData.email);

      // For testing purposes, we'll use a mock token
      // In a real scenario, this would come from email
      resetToken = 'valid-reset-token-' + Date.now();
    });

    it('should return 401 for invalid reset token', async () => {
      const response = await authHelper.resetPassword(
        resetToken,
        'NewPassword123!',
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toContain(
        'Password reset token has expired',
      );
    });

    it('should return 422 for weak new password', async () => {
      const weakPasswords = ['123', 'password', 'weak'];

      for (const password of weakPasswords) {
        const response = await authHelper.resetPassword(
          'valid-token',
          password,
        );
        expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(response.body.message).toContain('Validation failed');
      }
    });
  });

  describe('POST /api/v1/auth/reset-password - Error Cases', () => {
    it('should return 422 for weak new password', async () => {
      const weakPasswords = ['123', 'password', 'weak'];

      for (const password of weakPasswords) {
        const response = await authHelper.resetPassword(
          'valid-token',
          password,
        );
        expect(response.status).toBe(422);
        expect(response.body.message).toContain('Validation failed');
      }
    });

    it('should return 422 for missing required fields', async () => {
      const missingFields = [
        { token: '', password: 'ValidPass123!' },
        { token: 'valid-token', password: '' },
        { token: '', password: '' },
      ];

      for (const data of missingFields) {
        const response = await authHelper.resetPassword(
          data.token || '',
          data.password || '',
        );
        expect(response.status).toBe(422);
      }
    });
  });

  describe('Password Reset Integration Tests', () => {
    it('should handle complete password reset flow', async () => {
      // 1. Register user
      const timestamp = Date.now().toString().slice(-6);
      const userData = {
        email: `flow${timestamp}@example.com`,
        username: `user${timestamp}`,
        password: 'OriginalPass123!',
      };

      const registerResponse = await authHelper.registerUser(userData);
      expect(registerResponse.status).toBe(HttpStatus.CREATED);

      // 2. Request password reset
      const forgotResponse = await authHelper.requestPasswordReset(
        userData.email,
      );
      expect(forgotResponse.status).toBe(HttpStatus.CREATED);

      // 3. Reset password (should fail with invalid token)
      const newPassword = 'NewSecurePass456!';
      const resetResponse = await authHelper.resetPassword(
        'invalid-token',
        newPassword,
      );
      expect(resetResponse.status).toBe(HttpStatus.UNAUTHORIZED);

      // 4. Login with original password (should work since reset failed)
      const loginResponse = await authHelper.loginUser({
        email: userData.email,
        password: userData.password,
      });
      expect(loginResponse.status).toBe(HttpStatus.OK);
    });

    it('should handle concurrent password reset requests', async () => {
      const userData = {
        email: `concurrent-reset-${Date.now()}@example.com`,
        username: `concurrentresetuser-${Date.now()}`,
        password: 'OriginalPass123!',
      };

      await authHelper.registerUser(userData);

      // Multiple reset requests
      const promises = Array(3)
        .fill(null)
        .map(() => authHelper.requestPasswordReset(userData.email));

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(HttpStatus.CREATED);
      });
    });
  });
});
