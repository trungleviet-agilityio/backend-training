/**
 * User Comment E2E Tests
 * Tests user comments retrieval
 */

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { UserTestHelper } from '../utils/user-test.helper';
import { IUserRegistrationData } from '../interfaces/auth.interface';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

describe('User Comment (e2e)', () => {
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

  describe('GET /api/v1/users/:uuid/comments', () => {
    it('should return user comments', async () => {
      const res = await userHelper.getUserComments(uuid, jwt);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('items');
      expect(res.body.data).toHaveProperty('meta');

      // Check if comments are returned
      const comments = res.body.data.items;
      expect(comments).toBeDefined();
      expect(Array.isArray(comments)).toBe(true);
      // For a new user, comments will be empty, so just check array type
      // expect(comments.length).toBeGreaterThan(0);

      // Check if meta is present
      const { meta } = res.body.data;
      expect(meta).toBeDefined();
      expect(meta).toHaveProperty('page');
      expect(meta).toHaveProperty('limit');
      expect(meta).toHaveProperty('total');
      expect(meta).toHaveProperty('totalPages');
      expect(meta).toHaveProperty('hasNext');
      expect(meta).toHaveProperty('hasPrev');

      // Check if comments have the correct structure
      comments.forEach((comment: any) => {
        expect(comment).toHaveProperty('uuid');
        expect(comment).toHaveProperty('content');

        // Check if comment has the correct properties
        expect(comment).toHaveProperty('postUuid');
        expect(comment).toHaveProperty('userUuid');
        expect(comment).toHaveProperty('content');
        expect(comment).toHaveProperty('createdAt');
        expect(comment).toHaveProperty('updatedAt');
      });
    });
  });
});
