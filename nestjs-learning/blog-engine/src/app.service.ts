/**
 * Application Service
 * Core application service providing basic application information
 * and configuration details
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

/**
 * AppService provides core application functionality
 * including basic information and health status
 */
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Returns welcome message for the API
   */
  getHello(): string {
    return 'Welcome to Blog Engine API! 🚀';
  }

  /**
   * Returns basic application information
   */
  getInfo(): { name: string; version: string; description: string } {
    return {
      name: 'Blog Engine API',
      version: '1.0.0',
      description: 'A NestJS blog engine with Observer pattern implementation',
    };
  }
}
