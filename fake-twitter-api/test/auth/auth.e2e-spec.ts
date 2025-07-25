/**
 * Auth E2E Tests - Main Test Suite
 * Orchestrates all auth-related e2e tests with proper types
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthTestHelper } from '../utils/auth-test.helper';
import { AppModule } from '../../src/app.module';
import { ITestResponse } from '../interfaces/auth.interface';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

  describe('Health Check', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should have auth endpoints available', async () => {
      const response: ITestResponse = await authHelper.testEndpointAvailability(
        '/api/v1/auth/register',
      );
      expect(response.status).not.toBe(404);
    });
  });

  describe('Registration Tests', () => {
    require('./auth-register.e2e-spec');
  });

  describe('Login Tests', () => {
    require('./auth-login.e2e-spec');
  });

  describe('Token Management Tests', () => {
    require('./auth-token.e2e-spec');
  });

  describe('Password Reset Tests', () => {
    require('./auth-password.e2e-spec');
  });
});
