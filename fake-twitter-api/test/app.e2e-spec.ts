/**
 * App e2e tests
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same global pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('/api/v1/auth/register (POST) - should return 400 for invalid email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'invalid-email',
        username: 'testuser',
        password: '123', // too short
      })
      .expect(400);
  });

  it('/api/v1/auth/register (POST) - should return 400 for missing required fields', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        // missing username and password
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
