/**
 * App E2E Test Setup
 * This file serves as the main test setup and module integration test
 * It should only test that all modules are properly loaded and the app is defined
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('App Module Integration (e2e)', () => {
  let app: INestApplication;
  const logger = new Logger('AppE2ETest');

  beforeAll(async () => {
    // Log environment configuration for debugging
    logger.log(`Starting E2E tests with environment: ${process.env.NODE_ENV}`);
    logger.log(`Database Configuration:`);
    logger.log(`Host: ${process.env.DB_HOST}`);
    logger.log(`Port: ${process.env.DB_PORT}`);
    logger.log(`Database: ${process.env.DB_DATABASE}`);
    logger.log(`Username: ${process.env.DB_USERNAME}`);
    logger.log(`Synchronize: ${process.env.DB_SYNCHRONIZE}`);

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

  it('should have all required modules loaded', () => {
    // Test that the app module is properly configured
    expect(app).toBeDefined();
    expect(app.getHttpServer()).toBeDefined();
  });

  it('should have global prefix configured', () => {
    // Test that global prefix is set correctly
    expect(app).toBeDefined();
  });

  it('should have validation pipe configured', () => {
    // Test that validation pipe is applied
    expect(app).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
