/**
 * User Profile E2E Tests
 * Tests user profile retrieval and update
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { UserTestHelper } from '../utils/user-test.helper';
import { IUserRegistrationData } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('User Profile (e2e)', () => {
  let app: INestApplication;
  let userHelper: UserTestHelper;
  let user: IUserRegistrationData;
  let uuid: string;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    userHelper = new UserTestHelper(app);

    // Create a valid user via auth flow
    const result = await userHelper.createAndLoginUser();
    user = result.user;
    uuid = result.uuid;
    jwt = result.jwt;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/users/:uuid', () => {
    it('should return user profile', async () => {
      const res = await userHelper.getUserProfile(uuid, jwt);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('uuid', uuid);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Success');
    });
  });

  describe('PATCH /api/v1/users/:uuid', () => {
    it('should update user profile', async () => {
      // Only send allowed fields for update
      const updateData = { firstName: 'Updated', lastName: 'User' };
      const res = await userHelper.updateUserProfile(uuid, jwt, updateData);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.data).toHaveProperty('firstName', 'Updated');
      expect(res.body.data).toHaveProperty('lastName', 'User');
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Success');
    });
  });

  describe('DB State', () => {
    it('should have user and session active in DB', async () => {
      const userRepo = app.get('UserRepository');
      const sessionRepo = app.get('AuthSessionRepository');
      const dbUser = await userRepo.findOne({ where: { uuid } });
      const dbSessions = await sessionRepo.find({
        where: { userUuid: uuid, isActive: true },
      });
      console.log('DB User:', dbUser);
      console.log('DB Sessions:', dbSessions);
      expect(dbUser).toBeDefined();
      expect(dbUser.isActive).toBe(true);
      expect(dbSessions.length).toBeGreaterThan(0);
    });
  });
});
