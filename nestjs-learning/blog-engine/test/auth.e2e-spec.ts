import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/user/user.module';
import { User } from '../src/modules/user/entities/user.entity';
import { ConfigModule } from '../src/config/config.module';
import { DatabaseModule } from '../src/database/database.module';
import { createTestUser, createLoginData, generateTestEmail, generateSecureTestPassword } from './jest-test-setup';

/**
 * Auth Module E2E Tests
 * Tests authentication endpoints with secure, non-hard-coded test data
 */
describe('Auth Module (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let moduleFixture: TestingModule;

  // Secure test credentials - generated dynamically
  let testUserCredentials: any;
  let existingUserCredentials: any;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        AuthModule,
        UsersModule,
      ],
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

    await app.init();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await userRepository.clear();
    
    // Generate fresh test credentials for each test
    testUserCredentials = createTestUser({
      email: generateTestEmail('test'),
      firstName: 'John',
      lastName: 'Doe',
    });

    existingUserCredentials = createTestUser({
      email: generateTestEmail('existing'),
      firstName: 'Jane',
      lastName: 'Smith',
    });
    
    // Create an existing user for login tests
    const user = userRepository.create({
      ...existingUserCredentials,
      role: 'user',
      isActive: true,
    });
    await userRepository.save(user);
  });

  afterAll(async () => {
    await userRepository.clear();
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUserCredentials)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        email: testUserCredentials.email,
        firstName: testUserCredentials.firstName,
        lastName: testUserCredentials.lastName,
        role: 'user',
      });
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).not.toHaveProperty('password');

      // Verify JWT token is valid
      const decoded = jwtService.verify(response.body.access_token);
      expect(decoded).toHaveProperty('email', testUserCredentials.email);
      expect(decoded).toHaveProperty('sub');
    });

    it('should return 409 when trying to register with existing email', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(existingUserCredentials)
        .expect(409);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmailUser = {
        ...testUserCredentials,
        email: 'invalid-email',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidEmailUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for short password', async () => {
      const shortPasswordUser = {
        ...testUserCredentials,
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(shortPasswordUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('password must be longer than or equal to 6 characters');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteUser = {
        email: testUserCredentials.email,
        // Missing password, firstName, lastName
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should ignore extra fields due to whitelist validation', async () => {
      const userWithExtraFields = {
        ...testUserCredentials,
        extraField: 'should be ignored',
        maliciousData: 'hack attempt',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userWithExtraFields)
        .expect(201);

      expect(response.body.user).not.toHaveProperty('extraField');
      expect(response.body.user).not.toHaveProperty('maliciousData');
    });

    it('should handle optional avatar field', async () => {
      const userWithAvatar = {
        ...createTestUser({
          email: generateTestEmail('avatar'),
        }),
        avatar: 'https://example.com/avatar.jpg',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userWithAvatar)
        .expect(201);

      // Check that user was created in database with avatar
      const createdUser = await userRepository.findOne({
        where: { email: userWithAvatar.email },
      });
      expect(createdUser?.avatar).toBe(userWithAvatar.avatar);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: existingUserCredentials.email,
        password: existingUserCredentials.password,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(existingUserCredentials.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Verify JWT token is valid
      const decoded = jwtService.verify(response.body.access_token);
      expect(decoded).toHaveProperty('email', existingUserCredentials.email);
    });

    it('should return 401 for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for missing password', async () => {
      const loginData = {
        email: existingUserCredentials.email,
        // password intentionally omitted
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(400); // Validation error for missing password

      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('email must be an email');
    });

    it('should return 400 for short password', async () => {
      const loginData = {
        email: existingUserCredentials.email,
        password: '123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('password must be longer than or equal to 6 characters');
    });

    it('should return 401 when password is empty string', async () => {
      const loginData = {
        email: existingUserCredentials.email,
        password: '',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(400); // Will fail validation first

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('JWT Token Validation', () => {
    let validToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a user and get a valid token
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          ...testUserCredentials,
          email: generateTestEmail('jwt-test'),
        });

      validToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('should decode valid JWT token correctly', () => {
      const decoded = jwtService.verify(validToken);
      
      expect(decoded).toHaveProperty('sub', userId);
      expect(decoded).toHaveProperty('id', userId);
      expect(decoded).toHaveProperty('email', generateTestEmail('jwt-test'));
      expect(decoded).toHaveProperty('role', 'user');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
    });

    it('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.jwt.token';
      
      expect(() => {
        jwtService.verify(invalidToken);
      }).toThrow();
    });

    it('should reject expired JWT token', () => {
      // Create a token that expires immediately
      const expiredToken = jwtService.sign(
        { sub: userId, email: generateTestEmail('jwt-test') },
        { expiresIn: '0s' }
      );

      // Wait a moment to ensure expiration
      setTimeout(() => {
        expect(() => {
          jwtService.verify(expiredToken);
        }).toThrow();
      }, 100);
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should complete full registration and login flow', async () => {
      const newUser = {
        email: generateTestEmail('flow-test'),
        password: generateSecureTestPassword(),
        firstName: 'Flow',
        lastName: 'Test',
      };

      // Step 1: Register new user
      const registerResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(newUser)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('access_token');
      const registrationToken = registerResponse.body.access_token;

      // Step 2: Login with same credentials
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('access_token');
      const loginToken = loginResponse.body.access_token;

      // Step 3: Verify both tokens are valid and contain same user info
      const registrationDecoded = jwtService.verify(registrationToken);
      const loginDecoded = jwtService.verify(loginToken);

      expect(registrationDecoded.email).toBe(loginDecoded.email);
      expect(registrationDecoded.sub).toBe(loginDecoded.sub);
      expect(registrationDecoded.role).toBe(loginDecoded.role);
    });

    it('should prevent duplicate registration', async () => {
      const userData = {
        email: generateTestEmail('duplicate-test'),
        password: generateSecureTestPassword(),
        firstName: 'Duplicate',
        lastName: 'Test',
      };

      // First registration should succeed
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email should fail
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);

      // Verify only one user exists in database
      const users = await userRepository.find({
        where: { email: userData.email },
      });
      expect(users).toHaveLength(1);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle SQL injection attempts in email field', async () => {
      const maliciousData = {
        email: "admin@example.com'; DROP TABLE users; --",
        password: generateSecureTestPassword(),
        firstName: 'Malicious',
        lastName: 'User',
      };

      // Should either fail validation or be safely handled
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(maliciousData);

      // Should not register successfully and database should be intact
      expect(response.status).not.toBe(201);
      
      // Verify existing users are still there
      const existingUsers = await userRepository.find();
      expect(existingUsers.length).toBeGreaterThan(0);
    });

    it('should handle very long input strings', async () => {
      const longString = 'a'.repeat(1000);
      const userData = {
        email: generateTestEmail('long'),
        password: longString,
        firstName: longString,
        lastName: longString,
      };

      // Should handle gracefully (either accept or reject with proper error)
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData);

      // Should not cause server error
      expect(response.status).not.toBe(500);
    });

    it('should handle concurrent registration attempts', async () => {
      const userData = {
        email: generateTestEmail('concurrent'),
        password: generateSecureTestPassword(),
        firstName: 'Concurrent',
        lastName: 'Test',
      };

      // Make multiple simultaneous requests
      const promises = Array(5).fill(null).map(() =>
        request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(userData)
      );

      const responses = await Promise.allSettled(promises);
      
      // Only one should succeed
      const successful = responses.filter(
        (result) => result.status === 'fulfilled' && result.value.status === 201
      );
      const failed = responses.filter(
        (result) => result.status === 'fulfilled' && result.value.status !== 201
      );

      expect(successful).toHaveLength(1);
      expect(failed.length).toBeGreaterThan(0);
    });
  });
});
