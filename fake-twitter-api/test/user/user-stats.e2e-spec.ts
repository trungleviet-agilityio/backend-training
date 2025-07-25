/**
 * User Stats E2E Tests
 * Tests user stats retrieval
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { UserTestHelper } from '../utils/user-test.helper';
import { IUserRegistrationData } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('User Stats (e2e)', () => {
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

  describe('GET /api/v1/users/:uuid/stats', () => {
    it('should return user stats', async () => {
      const res = await userHelper.getUserStats(uuid, jwt);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('postsCount');
      expect(res.body.data).toHaveProperty('commentsCount');
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Success');
    });
  });
});
