/**
 * Application Bootstrap
 * Main entry point for the Blog Engine API
 * Configures and starts the NestJS application with all necessary middleware and plugins
 */

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create app with buffer logs enabled for better logging integration
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Enable all log levels
  });

  // Use simple Logger for startup
  const logger = new Logger('BlogEngineApp');

  // Use logger for the application
  app.useLogger(logger);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global serializer interceptor to handle @Exclude() decorators
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Global CORS middleware
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blog Engine API')
    .setDescription('A RESTful API for blog management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || 3000;

  // Start the server
  await app.listen(port);

  // Log startup information
  logger.log(`🚀 Blog Engine API started successfully on port ${port}`);
  logger.log(`📖 API Documentation: http://localhost:${port}/api/v1/docs`);
  logger.log(`💚 Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`📊 Log Level: ${process.env.LOG_LEVEL || 'debug'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Application failed to start:', error);
  process.exit(1);
});
