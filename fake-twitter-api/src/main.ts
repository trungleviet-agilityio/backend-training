/**
 * This file is the entry point of the application.
 * It is used to bootstrap the application.
 */

import { randomUUID } from 'crypto';
if (!global.crypto) global.crypto = { randomUUID } as any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Import the global interceptors and filters
import { GlobalExceptionFilter, ResponseInterceptor } from './common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log environment and database configuration
  logger.log(`🚀 Starting Fake Twitter API in ${process.env.NODE_ENV || 'development'} mode`);
  logger.log(`📊 Database Configuration:`);
  logger.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  logger.log(`   Port: ${process.env.DB_PORT || '5436'}`);
  logger.log(`   Database: ${process.env.DB_DATABASE || 'fake_twitter_db'}`);
  logger.log(`   Username: ${process.env.DB_USERNAME || 'fake_twitter_user'}`);
  logger.log(`   Synchronize: ${process.env.DB_SYNCHRONIZE || 'false'}`);

  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Fake Twitter API')
      .setDescription(
        'A comprehensive social media API with authentication, posts, and user management',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'User authentication and authorization')
      .addTag('Users', 'User management endpoints')
      .addTag('Posts', 'Post management endpoints')
      .addTag('Comments', 'Comment management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  const port = process.env.APP_PORT ?? 3000;
  await app.listen(port);

  logger.log(`✅ Fake Twitter API is running on port ${port}`);
  logger.log(`🔗 API Documentation: http://localhost:${port}/api/v1/docs`);
}
bootstrap();
