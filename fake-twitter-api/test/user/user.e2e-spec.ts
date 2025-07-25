/**
 * User E2E Tests - Main Test Suite
 * Orchestrates all user-related e2e tests with proper types
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { UserTestHelper } from '../utils/user-test.helper';
import { AppModule } from '../../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userHelper: UserTestHelper;

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
    userHelper = new UserTestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should have user endpoints available', async () => {
      // Directly use supertest to check endpoint availability
      const res = await require('supertest')(app.getHttpServer()).get(
        '/api/v1/users/some-uuid',
      );
      expect(res.status).not.toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('Profile Tests', () => {
    require('./user-profile.e2e-spec');
  });

  describe('Stats Tests', () => {
    require('./user-stats.e2e-spec');
  });

  describe('Posts Tests', () => {
    require('./user-posts.e2e-spec');
  });

  describe('Comments Tests', () => {
    require('./user-comment.e2e-spec');
  });

  describe('Delete Tests', () => {
    require('./user-delete.e2e-spec');
  });
});
