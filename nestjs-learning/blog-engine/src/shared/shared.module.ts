/**
 * Shared Module
 * Provides common functionality and constants that are shared across the application
 * Contains API metadata and shared services
 */

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestLoggerService } from '../config/config.service';

/**
 * SharedModule provides shared functionality for the application
 * Exports common constants and services that can be used by other modules
 */
@Module({
  imports: [],
  providers: [
    ConfigService,
    {
      provide: 'API_VERSION',
      useValue: 'v1',
    },
    {
      provide: 'API_NAME',
      useValue: 'blog-engine',
    },
    {
      provide: 'API_DESCRIPTION',
      useValue: 'Blog engine is a blog engine for the application.',
    },
    RequestLoggerService,
  ],
  exports: [
    ConfigService,
    'API_VERSION',
    'API_NAME',
    'API_DESCRIPTION',
    RequestLoggerService,
  ],
})
export class SharedModule {}
