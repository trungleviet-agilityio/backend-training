/**
 * This file is the entry point of the application.
 * It is used to bootstrap the application.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT ?? 3000 );
}
bootstrap();
