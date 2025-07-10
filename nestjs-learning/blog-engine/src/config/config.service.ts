/**
 * Configuration Service
 * Provides centralized configuration management for the application
 * Wraps NestJS ConfigService with additional functionality
 */

import { Injectable, Scope } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CustomLoggerService } from '../core/logger/custom-logger.service';

/**
 * ConfigService handles application configuration
 * Provides typed access to environment variables and configuration values
 */
@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  /**
   * Get configuration value by key
   * @param key Configuration key to retrieve
   * @returns Configuration value or undefined if not found
   */
  get(key: string): string | undefined {
    return this.configService.get(key);
  }

  /**
   * Get application configuration object
   * @returns Object containing core application configuration
   */
  getConfig() {
    return {
      version: this.get('API_VERSION'),
      name: this.get('API_NAME'),
      description: this.get('API_DESCRIPTION'),
      author: this.get('API_AUTHOR'),
      license: this.get('API_LICENSE'),
    };
  }
}

/**
 * Request Logger Service
 * Provides request-scoped logging functionality with unique request IDs
 * Each request gets its own instance for proper log correlation
 */
@Injectable({ scope: Scope.REQUEST })
export class RequestLoggerService {
  private requestId: string;
  private readonly logger: CustomLoggerService;

  constructor(logger: CustomLoggerService) {
    this.requestId = uuidv4();
    this.logger = logger;
    this.logger.setContext('RequestLoggerService');

    this.logger.debug('📋 Request logger created', {
      requestId: this.requestId,
      component: 'REQUEST_LOGGER',
      action: 'CREATE',
    });
  }

  /**
   * Log informational message with request context
   */
  log(message: string, context: string = 'Request') {
    this.logger.log(`📝 ${message}`, {
      requestId: this.requestId,
      component: context.toUpperCase(),
      action: 'LOG',
    });
  }

  /**
   * Log debug message with request context
   */
  debug(message: string, context: string = 'Request') {
    this.logger.debug(`🔍 ${message}`, {
      requestId: this.requestId,
      component: context.toUpperCase(),
      action: 'DEBUG',
    });
  }

  /**
   * Log warning message with request context
   */
  warn(message: string, context: string = 'Request') {
    this.logger.warn(`⚠️ ${message}`, {
      requestId: this.requestId,
      component: context.toUpperCase(),
      action: 'WARN',
    });
  }

  /**
   * Log error message with request context and error details
   */
  error(message: string, error?: any, context: string = 'Request') {
    this.logger.error(`❌ ${message}`, {
      requestId: this.requestId,
      component: context.toUpperCase(),
      action: 'ERROR',
      metadata: {
        error: error?.message || error,
      },
    });
  }
}
