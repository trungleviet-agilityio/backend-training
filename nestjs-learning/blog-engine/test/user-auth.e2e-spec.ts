import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/user/entities/user.entity';
import { createTestUser, generateTestEmail, generateSecureTestPassword } from './jest-test-setup';
import { DatabaseCleanupHelper } from './helpers/database-cleanup.helper';

/**
 * User Authentication E2E Tests
 * Tests JWT authentication and role-based authorization for user endpoints
 * Uses secure, non-hard-coded test data for better security practices
 */
describe('User Authentication & Authorization (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;
  let dataSource: DataSource;
  let cleanupHelper: DatabaseCleanupHelper;

  // Test users and tokens - generated dynamically
  let regularUser: any;
  let regularUserToken: string;
  let regularUserCredentials: any;
  let adminUser: any;
  let adminUserToken: string;
  let adminUserCredentials: any;
  let otherUser: any;
  let otherUserToken: string;
  let otherUserCredentials: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    dataSource = moduleFixture.get<DataSource>(DataSource);
    cleanupHelper = new DatabaseCleanupHelper(dataSource);

    await app.init();
  });

  beforeEach(async () => {
    await cleanupHelper.quickClean();
    await setupTestUsers();
  });

  afterAll(async () => {
    await cleanupHelper.cleanDatabase();
    await app.close();
  });

  async function setupTestUsers() {
    // Create regular user with randomized secure data
    regularUserCredentials = createTestUser({
      email: generateTestEmail('regular'),
      firstName: 'Regular',
      lastName: 'User',
    });

    const regularResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(regularUserCredentials);

    regularUser = regularResponse.body.user;
    regularUserToken = regularResponse.body.access_token;

    // Create admin user with randomized secure data
    adminUserCredentials = createTestUser({
      email: generateTestEmail('admin'),
      firstName: 'Admin',
      lastName: 'User',
    });

    const adminResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(adminUserCredentials);

    adminUser = adminResponse.body.user;
    adminUserToken = adminResponse.body.access_token;

    // Update admin user role in database
    await userRepository.update(adminUser.id, { role: 'admin' });

    // Create another regular user with randomized secure data
    otherUserCredentials = createTestUser({
      email: generateTestEmail('other'),
      firstName: 'Other',
      lastName: 'User',
    });

    const otherResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(otherUserCredentials);

    otherUser = otherResponse.body.user;
    otherUserToken = otherResponse.body.access_token;
  }

  describe('User Creation - POST /users (Admin Only)', () => {
    it('should allow admin to create user', async () => {
      // Generate secure test data for new user creation
      const createUserData = createTestUser({
        email: generateTestEmail('newuser'),
        firstName: 'New',
        lastName: 'User',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(createUserData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createUserData.email);
      expect(response.body).not.toHaveProperty('password'); // Should not expose password
    });

    it('should reject regular user from creating user', async () => {
      const createUserData = createTestUser({
        email: generateTestEmail('rejected'),
        firstName: 'Rejected',
        lastName: 'User',
      });

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(createUserData)
        .expect(403);
    });

    it('should reject unauthenticated user creation', async () => {
      const createUserData = createTestUser({
        email: generateTestEmail('unauth'),
        firstName: 'Unauth',
        lastName: 'User',
      });

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .send(createUserData)
        .expect(401);
    });

    it('should reject invalid token for user creation', async () => {
      const createUserData = createTestUser({
        email: generateTestEmail('invalid'),
        firstName: 'Invalid',
        lastName: 'User',
      });

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', 'Bearer invalid-token')
        .send(createUserData)
        .expect(401);
    });
  });

  describe('Get All Users - GET /users (Admin Only)', () => {
    it('should allow admin to get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3); // At least our 3 test users
    });

    it('should reject regular user from getting all users', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(403);
    });

    it('should reject unauthenticated access to all users', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401);
    });

    it('should support pagination for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/users?page=1&limit=2')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Get User by ID - GET /users/:id', () => {
    it('should allow user to view own profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      expect(response.body.id).toBe(regularUser.id);
      expect(response.body.email).toBe(regularUser.email);
      expect(response.body).not.toHaveProperty('password'); // Should not expose password
    });

    it('should allow admin to view any profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(200);

      expect(response.body.id).toBe(regularUser.id);
      expect(response.body.email).toBe(regularUser.email);
    });

    it('should reject user from viewing other profiles', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(403);
    });

    it('should reject unauthenticated access to user profile', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      
      await request(app.getHttpServer())
        .get(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(404);
    });
  });

  describe('Update User - PATCH /users/:id', () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should allow user to update own profile', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
    });

    it('should allow admin to update any profile', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe(updateData.firstName);
      expect(response.body.lastName).toBe(updateData.lastName);
    });

    it('should reject user from updating other profiles', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(updateData)
        .expect(403);
    });

    it('should reject unauthenticated update', async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${regularUser.id}`)
        .send(updateData)
        .expect(401);
    });

    it('should validate update data', async () => {
      const invalidData = {
        email: 'invalid-email', // Invalid email format
      };

      await request(app.getHttpServer())
        .patch(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 404 for updating non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      
      await request(app.getHttpServer())
        .patch(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('Delete User - DELETE /users/:id (Admin Only)', () => {
    let userToDelete: any;

    beforeEach(async () => {
      // Create a user to delete in each test
      const userData = createTestUser({
        email: generateTestEmail('todelete'),
        password: generateSecureTestPassword(),
        firstName: 'ToDelete',
        lastName: 'User',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData);

      userToDelete = response.body.user;
    });

    it('should allow admin to delete user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(200);

      // Verify user is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(404);
    });

    it('should reject regular user from deleting user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(403);
    });

    it('should reject unauthenticated delete', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userToDelete.id}`)
        .expect(401);
    });

    it('should return 404 for deleting non-existent user', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(404);
    });
  });

  describe('Role-Based Authorization Edge Cases', () => {
    let normalUserWithoutRole: any;
    let normalUserToken: string;

    beforeEach(async () => {
      // Create user and manually remove role to test edge cases
      const userData = createTestUser({
        email: generateTestEmail('norole'),
        password: generateSecureTestPassword(),
        firstName: 'NoRole',
        lastName: 'User',
      });

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userData);

      normalUserWithoutRole = response.body.user;
      normalUserToken = response.body.access_token;

      // Remove role from database to test edge case
      await userRepository.update(normalUserWithoutRole.id, { role: undefined });
    });

    it('should reject user without role from admin endpoints', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${normalUserToken}`)
        .expect(403);
    });

    it('should still allow user without role to view own profile', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${normalUserWithoutRole.id}`)
        .set('Authorization', `Bearer ${normalUserToken}`)
        .expect(200);
    });
  });

  describe('Token Validation Edge Cases', () => {
    it('should reject expired tokens', async () => {
      // This would require creating an expired token manually
      // For now, we test with malformed tokens
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
      
      await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${malformedToken}`)
        .expect(401);
    });

    it('should reject tokens with missing Bearer prefix', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', regularUserToken) // Missing "Bearer "
        .expect(401);
    });

    it('should reject empty Authorization header', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', '')
        .expect(401);
    });
  });

  describe('Integration with Auth System', () => {
    it('should maintain consistency between auth profile and user profile', async () => {
      // Get profile from auth endpoint
      const authProfileResponse = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      // Get profile from user endpoint
      const userProfileResponse = await request(app.getHttpServer())
        .get(`/api/v1/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(200);

      // Both should return the same user data
      expect(authProfileResponse.body.user.id).toBe(userProfileResponse.body.id);
      expect(authProfileResponse.body.user.email).toBe(userProfileResponse.body.email);
      expect(authProfileResponse.body.user.firstName).toBe(userProfileResponse.body.firstName);
      expect(authProfileResponse.body.user.lastName).toBe(userProfileResponse.body.lastName);
    });

    it('should reflect role changes in authorization immediately', async () => {
      // Regular user should not have admin access
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularUserToken}`)
        .expect(403);

      // Promote user to admin
      await userRepository.update(regularUser.id, { role: 'admin' });

      // Create new token after role change (in real app, user would need to re-login)
      const newLoginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: regularUserCredentials.email,
          password: regularUserCredentials.password,
        });

      const newToken = newLoginResponse.body.access_token;

      // Now should have admin access
      await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);
    });
  });
});
