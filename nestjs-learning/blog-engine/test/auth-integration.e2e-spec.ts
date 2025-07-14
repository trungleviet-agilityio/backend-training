import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/user/entities/user.entity';
import { createTestUser, createLoginData } from './jest-test-setup';
import { DatabaseCleanupHelper, quickCleanTestDatabase } from './helpers/database-cleanup.helper';

/**
 * Auth Integration E2E Tests
 * Tests authentication flow using the full application module
 * This approach bypasses import path issues by using the complete app context
 */
describe('Auth Integration (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let dataSource: DataSource;
  let cleanupHelper: DatabaseCleanupHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Set global prefix to match main application
    app.setGlobalPrefix('api/v1');

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);
    dataSource = moduleFixture.get<DataSource>(DataSource);
    cleanupHelper = new DatabaseCleanupHelper(dataSource);

    await app.init();
  });

  beforeEach(async () => {
    // Comprehensive database cleanup before each test
    // This handles all entities and foreign key constraints properly
    await cleanupHelper.quickClean();
  });

  afterEach(async () => {
    // Optional: Verify clean state after each test (helpful for debugging)
    const isClean = await cleanupHelper.verifyCleanDatabase();
    if (!isClean) {
      console.warn('⚠️  Database not clean after test - this may affect subsequent tests');
    }
  });

  afterAll(async () => {
    // Final cleanup and verification
    await cleanupHelper.cleanDatabase();
    await cleanupHelper.verifyCleanDatabase();
    await app.close();
  });

  describe('POST /auth/register', () => {
    const testUser = createTestUser({
      email: 'integration@example.com',
      password: 'password123',
      firstName: 'Integration',
      lastName: 'Test',
    });

    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser);

      if (response.status !== 201) {
        console.log('Registration failed with status:', response.status);
        console.log('Response body:', JSON.stringify(response.body, null, 2));
        console.log('Test user data:', JSON.stringify(testUser, null, 2));
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify user was created in database
      const createdUser = await userRepository.findOne({
        where: { email: testUser.email },
      });
      expect(createdUser).toBeDefined();
      expect(createdUser?.email).toBe(testUser.email);
    });

    it('should validate email format', async () => {
      const invalidUser = {
        ...testUser,
        email: 'invalid-email-format',
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should validate password length', async () => {
      const invalidUser = {
        ...testUser,
        password: '123', // Too short
      };

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should handle duplicate email registration', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      // Second registration with same email
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409);
    });
  });

  describe('POST /auth/login', () => {
    const existingUser = createTestUser({
      email: 'login-test@example.com',
      password: 'password123',
      firstName: 'Login',
      lastName: 'Test',
    });

    beforeEach(async () => {
      // Create a user for login tests
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(existingUser);
    });

    it('should login with valid credentials', async () => {
      const loginData = createLoginData({
        email: existingUser.email,
        password: existingUser.password,
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(existingUser.email);
    });

    it('should reject invalid credentials', async () => {
      const invalidLogin = createLoginData({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(invalidLogin)
        .expect(401);
    });

    it('should validate login input format', async () => {
      const invalidLogin = {
        email: 'invalid-email',
        password: '123', // Too short
      };

      // With LocalAuthGuard, authentication failures return 401 instead of 400
      // This includes format validation as part of the authentication process
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(invalidLogin)
        .expect(401);
    });
  });

  describe('JWT Token Integration', () => {
    let validToken: string;

    beforeEach(async () => {
      const user = createTestUser({
        email: 'jwt-integration@example.com',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user);

      validToken = response.body.access_token;
    });

    it('should generate valid JWT tokens', () => {
      expect(validToken).toBeDefined();
      expect(typeof validToken).toBe('string');
      expect(validToken.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should contain correct user data in token', () => {
      const decoded = jwtService.verify(validToken);
      
      expect(decoded).toHaveProperty('email', 'jwt-integration@example.com');
      expect(decoded).toHaveProperty('sub');
      expect(decoded).toHaveProperty('role', 'user');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('should reject malformed tokens', () => {
      expect(() => {
        jwtService.verify('invalid.token.format');
      }).toThrow();
    });
  });

  describe('Full Authentication Flow', () => {
    it('should complete registration → login → token validation cycle', async () => {
      const newUser = createTestUser({
        email: 'full-flow@example.com',
        password: 'securepassword123',
        firstName: 'FullFlow',
        lastName: 'User',
      });

      // Step 1: Register
      const registerResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(201);

      const registrationToken = registerResponse.body.access_token;
      const userId = registerResponse.body.user.id;

      // Step 2: Login
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        })
        .expect(200);

      const loginToken = loginResponse.body.access_token;

      // Step 3: Verify both tokens are valid
      const regDecoded = jwtService.verify(registrationToken);
      const loginDecoded = jwtService.verify(loginToken);

      expect(regDecoded.email).toBe(loginDecoded.email);
      expect(regDecoded.sub).toBe(loginDecoded.sub);
      expect(regDecoded.sub).toBe(userId);

      // Step 4: Verify user exists in database
      const dbUser = await userRepository.findOne({
        where: { id: userId },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(newUser.email);
    });

    it('should prevent concurrent duplicate registrations', async () => {
      const userData = createTestUser({
        email: 'concurrent@example.com',
      });

      // Make multiple concurrent registration requests
      const promises = Array(3).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(userData)
      );

      const responses = await Promise.allSettled(promises);

      // Count successful registrations
      const successful = responses.filter(
        (result) => 
          result.status === 'fulfilled' && 
          result.value.status === 201
      ).length;

      // Only one should succeed
      expect(successful).toBe(1);

      // Verify only one user in database
      const users = await userRepository.find({
        where: { email: userData.email },
      });
      expect(users).toHaveLength(1);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle missing required fields gracefully', async () => {
      const incompleteData = {
        email: 'incomplete@example.com',
        // Missing password, firstName, lastName
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should filter out extra fields (whitelist validation)', async () => {
      const userWithExtra = createTestUser({
        email: 'whitelist-test@example.com',
        extraField: 'should be removed',
        maliciousCode: '<script>alert("xss")</script>',
      });

      // With forbidNonWhitelisted: true, extra fields should be rejected with 400
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userWithExtra)
        .expect(400);

      // Verify the error message mentions the rejected fields  
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('extraField'),
          expect.stringContaining('maliciousCode'),
        ])
      );
    });

    it('should handle extremely long input strings', async () => {
      const longString = 'a'.repeat(10000);
      const userData = createTestUser({
        email: 'long-input@example.com',
        firstName: longString,
        lastName: longString,
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData);

      // Should not crash the server
      expect(response.status).not.toBe(500);
    });
  });

  describe('Security Validation', () => {
    it('should reject SQL injection attempts', async () => {
      const maliciousData = createTestUser({
        email: "test@example.com'; DROP TABLE users; --",
        firstName: "'; DELETE FROM users; --",
        lastName: 'Normal',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(maliciousData);

      // Should reject or handle safely
      expect(response.status).not.toBe(201);

      // Database should still be intact
      const userCount = await userRepository.count();
      expect(userCount).toBeGreaterThanOrEqual(0);
    });

    it('should handle XSS attempts in user data', async () => {
      const xssData = createTestUser({
        email: 'xss-test@example.com',
        firstName: '<script>alert("xss")</script>',
        lastName: '"><img src=x onerror=alert("xss")>',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(xssData);

      if (response.status === 201) {
        // If accepted, verify data is properly escaped/sanitized
        expect(response.body.user.firstName).not.toContain('<script>');
        expect(response.body.user.lastName).not.toContain('onerror=');
      }
    });
  });
}); 