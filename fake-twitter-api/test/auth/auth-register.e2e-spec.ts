/**
 * Auth Registration E2E Tests
 * Tests user registration functionality with proper types
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthTestHelper } from '../utils/auth-test.helper';
import { AuthFixtures } from '../fixtures/auth.fixtures';

import {
  IUserRegistrationData,
  IRegisterTestResponse,
} from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('Auth Registration (e2e)', () => {
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

  describe('POST /api/v1/auth/register - Success Cases', () => {
    it('should register a new user successfully with all fields', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const userData: IUserRegistrationData = {
        ...AuthFixtures.validRegistrationData,
        email: `test-${Date.now()}@example.com`,
        username: `testuser${timestamp}`,
      };

      const response: IRegisterTestResponse =
        await authHelper.registerUser(userData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        success: true,
        message: AuthFixtures.expectedSuccessMessages.registration,
        data: {
          user: {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
          tokens: {
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          },
        },
      });

      // Verify tokens are valid JWT format
      authHelper.expectValidJwtToken(
        response.body.data?.tokens?.access_token as string,
      );
      authHelper.expectValidJwtToken(
        response.body.data?.tokens?.refresh_token as string,
      );
    });

    it('should register user with minimal required fields', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const userData: IUserRegistrationData = {
        ...AuthFixtures.minimalRegistrationData,
        email: `minimal-${Date.now()}@example.com`,
        username: `minimaluser${timestamp}`,
      };

      const response: IRegisterTestResponse =
        await authHelper.registerUser(userData);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data?.user).toMatchObject({
        username: userData.username,
      });
      expect(response.body.data?.user?.firstName).toBeNull();
      expect(response.body.data?.user?.lastName).toBeNull();
    });

    it('should register multiple users with different data', async () => {
      const users: IUserRegistrationData[] = [
        {
          email: `user1-${Date.now()}@example.com`,
          username: `user1${Date.now().toString().slice(-6)}`,
          password: 'SecurePass123!',
          firstName: 'User',
          lastName: 'One',
        },
        {
          email: `user2-${Date.now()}@example.com`,
          username: `user2${Date.now().toString().slice(-6)}`,
          password: 'AnotherPass456!',
          firstName: 'User',
          lastName: 'Two',
        },
      ];

      for (const userData of users) {
        const response: IRegisterTestResponse =
          await authHelper.registerUser(userData);
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.body.data?.user?.username).toBe(userData.username);
      }
    });
  });

  describe('POST /api/v1/auth/register - Validation Errors', () => {
    it('should return 400 for invalid email formats', async () => {
      for (const invalidEmail of AuthFixtures.invalidEmails) {
        const userData: IUserRegistrationData = {
          ...AuthFixtures.validRegistrationData,
          email: invalidEmail,
          username: `testuser-${Date.now()}`,
        };

        const response: IRegisterTestResponse =
          await authHelper.registerUser(userData);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain(
          AuthFixtures.expectedErrorMessages.invalidEmail,
        );
      }
    });

    it('should return 400 for weak passwords', async () => {
      for (const weakPassword of AuthFixtures.weakPasswords) {
        const userData: IUserRegistrationData = {
          ...AuthFixtures.validRegistrationData,
          email: `test-${Date.now()}@example.com`,
          username: `testuser-${Date.now()}`,
          password: weakPassword,
        };

        const response: IRegisterTestResponse =
          await authHelper.registerUser(userData);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toContain(
          AuthFixtures.expectedErrorMessages.weakPassword,
        );
      }
    });

    it('should return 400 for invalid usernames', async () => {
      for (const invalidUsername of AuthFixtures.invalidUsernames) {
        const userData: IUserRegistrationData = {
          ...AuthFixtures.validRegistrationData,
          email: `test-${Date.now()}@example.com`,
          username: invalidUsername,
        };

        const response: IRegisterTestResponse =
          await authHelper.registerUser(userData);
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return 400 for missing required fields', async () => {
      const missingFields: Partial<IUserRegistrationData>[] = [
        { username: 'testuser', password: 'SecurePass123!' },
        { email: 'test@example.com', password: 'SecurePass123!' },
        { email: 'test@example.com', username: 'testuser' },
      ];

      for (const data of missingFields) {
        const response: IRegisterTestResponse = await authHelper.registerUser(
          data as IUserRegistrationData,
        );
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toBeDefined();
      }
    });
  });

  describe('POST /api/v1/auth/register - Conflict Errors', () => {
    it('should return 409 for duplicate email', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const userData: IUserRegistrationData = {
        ...AuthFixtures.validRegistrationData,
        email: `duplicate-${Date.now()}@example.com`,
        username: `user1${timestamp}`,
      };

      // First registration
      await authHelper.registerUser(userData);

      // Second registration with same email
      const duplicateData: IUserRegistrationData = {
        ...userData,
        username: `user2${timestamp}`,
      };

      const response: IRegisterTestResponse =
        await authHelper.registerUser(duplicateData);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toContain(
        AuthFixtures.expectedErrorMessages.duplicateEmail,
      );
    });

    it('should return 409 for duplicate username', async () => {
      const timestamp = Date.now().toString().slice(-6);
      const userData: IUserRegistrationData = {
        ...AuthFixtures.validRegistrationData,
        email: `user1-${Date.now()}@example.com`,
        username: `duplicateuser${timestamp}`,
      };

      // First registration
      await authHelper.registerUser(userData);

      // Second registration with same username
      const duplicateData: IUserRegistrationData = {
        ...userData,
        email: `user2-${Date.now()}@example.com`,
      };

      const response: IRegisterTestResponse =
        await authHelper.registerUser(duplicateData);
      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toContain(
        AuthFixtures.expectedErrorMessages.duplicateUsername,
      );
    });
  });
});
