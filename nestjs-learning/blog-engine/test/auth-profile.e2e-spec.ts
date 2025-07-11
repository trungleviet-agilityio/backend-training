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
import { DatabaseCleanupHelper } from './helpers/database-cleanup.helper';

/**
 * Auth Profile E2E Tests
 * Tests JWT authentication guards and protected endpoints
 */
describe('Auth Profile & Guards (e2e)', () => {
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
    await cleanupHelper.quickClean();
  });

  afterEach(async () => {
    // Verify clean state after each test (helpful for debugging)
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

  describe('JWT Protected Endpoints', () => {
    let validToken: string;
    let testUserId: string;

    beforeEach(async () => {
      // Create and register a test user
      const testUser = createTestUser({
        email: 'profile-test@example.com',
        password: 'securepassword123',
        firstName: 'Profile',
        lastName: 'Test',
      });

      const registerResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201);

      validToken = registerResponse.body.access_token;
      testUserId = registerResponse.body.user.id;
    });

    describe('GET /auth/profile', () => {
      it('should get user profile with valid JWT token', async () => {
        const response = await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toMatchObject({
          id: testUserId,
          email: 'profile-test@example.com',
          firstName: 'Profile',
          lastName: 'Test',
          role: 'user',
          isActive: true,
        });

        // Should not expose sensitive data
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).toHaveProperty('createdAt');
        expect(response.body.user).toHaveProperty('updatedAt');
      });

      it('should reject request without JWT token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .expect(401);
      });

      it('should reject request with invalid JWT token', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', 'Bearer invalid-token-here')
          .expect(401);
      });

      it('should reject request with malformed Authorization header', async () => {
        await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', 'InvalidFormat token-here')
          .expect(401);
      });

      it('should reject request with expired JWT token', async () => {
        // For testing expired tokens, we'll create a valid token and then wait for it to expire
        // OR create an invalid/malformed token that looks expired
        const invalidExpiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';

        await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${invalidExpiredToken}`)
          .expect(401);
      });
    });

    describe('JWT Token Content Validation', () => {
      it('should contain correct user data in JWT token', () => {
        const decoded = jwtService.verify(validToken);
        
        expect(decoded).toHaveProperty('sub', testUserId);
        expect(decoded).toHaveProperty('id', testUserId);
        expect(decoded).toHaveProperty('email', 'profile-test@example.com');
        expect(decoded).toHaveProperty('role', 'user');
        expect(decoded).toHaveProperty('iat');
        expect(decoded).toHaveProperty('exp');

        // Verify token expiration is in the future
        expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      });

      it('should generate different tokens for different users', async () => {
        // Create second user
        const secondUser = createTestUser({
          email: 'second-user@example.com',
          password: 'password123',
          firstName: 'Second',
          lastName: 'User',
        });

        const secondRegisterResponse = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(secondUser)
          .expect(201);

        const secondToken = secondRegisterResponse.body.access_token;

        // Tokens should be different
        expect(validToken).not.toBe(secondToken);

        // Decoded payloads should have different user data
        const firstDecoded = jwtService.verify(validToken);
        const secondDecoded = jwtService.verify(secondToken);

        expect(firstDecoded.email).not.toBe(secondDecoded.email);
        expect(firstDecoded.id).not.toBe(secondDecoded.id);
      });
    });

    describe('Authentication Flow with Profile', () => {
      it('should complete full auth flow: register → login → profile access', async () => {
        // Step 1: Register new user
        const newUser = createTestUser({
          email: 'full-flow-profile@example.com',
          password: 'flowpassword123',
          firstName: 'FullFlow',
          lastName: 'Profile',
        });

        const registerResponse = await request(app.getHttpServer())
          .post('/api/v1/auth/register')
          .send(newUser)
          .expect(201);

        const registerToken = registerResponse.body.access_token;
        const userId = registerResponse.body.user.id;

        // Step 2: Login with same credentials
        const loginData = createLoginData({
          email: newUser.email,
          password: newUser.password,
        });

        const loginResponse = await request(app.getHttpServer())
          .post('/api/v1/auth/login')
          .send(loginData)
          .expect(200);

        const loginToken = loginResponse.body.access_token;

        // Step 3: Access profile with registration token
        const profileResponse1 = await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${registerToken}`)
          .expect(200);

        // Step 4: Access profile with login token
        const profileResponse2 = await request(app.getHttpServer())
          .get('/api/v1/auth/profile')
          .set('Authorization', `Bearer ${loginToken}`)
          .expect(200);

        // Both tokens should provide access to the same user profile
        expect(profileResponse1.body.user.id).toBe(userId);
        expect(profileResponse2.body.user.id).toBe(userId);
        expect(profileResponse1.body.user.email).toBe(newUser.email);
        expect(profileResponse2.body.user.email).toBe(newUser.email);
      });
    });
  });

  describe('Real Authentication vs Previous Mocking', () => {
    it('should properly hash and verify passwords (no more mocking)', async () => {
      const password = 'test-password-123';
      const user = createTestUser({
        email: 'hash-test@example.com',
        password,
      });

      // Register user
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user)
        .expect(201);

      // Verify user is stored with hashed password (not plaintext)
      const savedUser = await userRepository.findOne({
        where: { email: user.email },
      });

      expect(savedUser).toBeDefined();
      expect(savedUser?.password).not.toBe(password); // Should be hashed
      expect(savedUser?.password).toMatch(/^\$2[ab]\$\d+\$/); // bcrypt pattern

      // Login should work with original password
      const loginData = createLoginData({
        email: user.email,
        password,
      });

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      // Login should fail with wrong password
      const wrongLoginData = createLoginData({
        email: user.email,
        password: 'wrong-password',
      });

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(wrongLoginData)
        .expect(401);
    });

    it('should enforce user account status (inactive users rejected)', async () => {
      const user = createTestUser({
        email: 'inactive-test@example.com',
        password: 'password123',
      });

      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(user)
        .expect(201);

      // Manually deactivate user in database
      await userRepository.update(
        { email: user.email },
        { isActive: false }
      );

      // Login should fail for inactive user
      const loginData = createLoginData({
        email: user.email,
        password: user.password,
      });

      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      // Profile access should also fail with existing token
      const token = registerResponse.body.access_token;
      
      await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);
    });
  });
});
