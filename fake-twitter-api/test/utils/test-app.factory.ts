/**
 * Test App Factory
 * Provides a factory for creating test applications with consistent configuration
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter, ResponseInterceptor } from '../../src/common';

export class TestAppFactory {
  private static logger = new Logger('TestAppFactory');

  /**
   * Creates a test application with consistent configuration
   */
  static async createTestApp(): Promise<INestApplication> {
    this.logger.log('Creating test application...');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    // Apply the same global pipes as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    // Apply the same global interceptors and filters as in main.ts
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.setGlobalPrefix('api/v1');
    await app.init();

    this.logger.log('Test application created successfully');
    return app;
  }

  /**
   * Creates a test application with custom configuration
   */
  static async createTestAppWithConfig(config: {
    globalPrefix?: string;
    validationPipe?: boolean;
    responseInterceptor?: boolean;
    globalExceptionFilter?: boolean;
  }): Promise<INestApplication> {
    this.logger.log('Creating test application with custom config...');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    if (config.validationPipe !== false) {
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );
    }

    if (config.responseInterceptor !== false) {
      app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
    }

    if (config.globalExceptionFilter !== false) {
      app.useGlobalFilters(new GlobalExceptionFilter());
    }

    if (config.globalPrefix) {
      app.setGlobalPrefix(config.globalPrefix);
    } else {
      app.setGlobalPrefix('api/v1');
    }

    await app.init();

    this.logger.log('Test application created successfully with custom config');
    return app;
  }
}
