/**
 * Request Context Service
 * Provides request-scoped context management for tracking user data,
 * request metadata, and other request-specific information
 */

import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  IRequestContext,
  RequestMetadata,
} from '../interfaces/request-context.interface';
import { CustomLoggerService } from '../../../core/logger/custom-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService implements IRequestContext {
  private readonly requestId: string;
  private userId?: string;
  private readonly metadata: Map<string, any>;
  private readonly requestMetadata: RequestMetadata;
  private readonly logger: CustomLoggerService;

  constructor(logger: CustomLoggerService) {
    this.logger = logger;
    this.logger.setContext('RequestContextService');
    this.requestId = uuidv4();
    this.metadata = new Map();
    this.requestMetadata = {
      timestamp: new Date(),
      path: '',
      method: '',
    };

    this.logger.debug('🎯 Request context created', {
      requestId: this.requestId,
      component: 'CONTEXT',
      action: 'CREATE',
      metadata: {
        timestamp: this.requestMetadata.timestamp.toISOString(),
      },
    });
  }

  /**
   * Get the unique request ID for this request
   */
  getRequestId(): string {
    return this.requestId;
  }

  /**
   * Set the user ID for this request
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.setMetadata('userId', userId);
    this.logger.debug('User ID set for request', {
      requestId: this.requestId,
      userId,
    });
  }

  /**
   * Get the user ID for this request
   */
  getUserId(): string | undefined {
    return this.userId;
  }

  /**
   * Set metadata for this request
   */
  setMetadata(key: string, value: any): void {
    this.metadata.set(key, value);
  }

  /**
   * Get metadata value by key
   */
  getMetadata(key: string): any {
    return this.metadata.get(key);
  }

  /**
   * Get all metadata for this request
   */
  getAllMetadata(): Map<string, any> {
    return new Map(this.metadata);
  }

  /**
   * Clear all metadata (except system metadata)
   */
  clear(): void {
    // Keep system metadata
    const systemKeys = ['userId', 'requestStartTime'];
    const systemMetadata = new Map();

    systemKeys.forEach((key) => {
      if (this.metadata.has(key)) {
        systemMetadata.set(key, this.metadata.get(key));
      }
    });

    this.metadata.clear();
    systemMetadata.forEach((value, key) => {
      this.metadata.set(key, value);
    });
  }

  /**
   * Set request metadata (called by middleware/interceptors)
   */
  setRequestMetadata(metadata: Partial<RequestMetadata>): void {
    Object.assign(this.requestMetadata, metadata);
  }

  /**
   * Get request metadata
   */
  getRequestMetadata(): RequestMetadata {
    return { ...this.requestMetadata };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.userId;
  }

  /**
   * Get user context summary
   */
  getUserContext(): {
    requestId: string;
    userId?: string;
    isAuthenticated: boolean;
    requestMetadata: RequestMetadata;
    customMetadata: Record<string, any>;
  } {
    const customMetadata: Record<string, any> = {};
    this.metadata.forEach((value, key) => {
      if (!['userId', 'requestStartTime'].includes(key)) {
        customMetadata[key] = value;
      }
    });

    return {
      requestId: this.requestId,
      userId: this.userId,
      isAuthenticated: this.isAuthenticated(),
      requestMetadata: this.getRequestMetadata(),
      customMetadata,
    };
  }

  /**
   * Log context information (for debugging)
   */
  logContext(message: string): void {
    this.logger.debug(`Context info: ${message}`, {
      requestId: this.requestId,
      userId: this.userId,
      component: 'CONTEXT',
      action: 'LOG_CONTEXT',
      metadata: {
        path: this.requestMetadata.path,
        method: this.requestMetadata.method,
        timestamp: this.requestMetadata.timestamp.toISOString(),
        metadataCount: this.metadata.size,
      },
    });
  }

  getMetadataSummary(): {
    requestId: string;
    userId?: string;
    path: string;
    method: string;
    timestamp: Date;
    metadataCount: number;
  } {
    return {
      requestId: this.requestId,
      userId: this.userId,
      path: this.requestMetadata.path,
      method: this.requestMetadata.method,
      timestamp: this.requestMetadata.timestamp,
      metadataCount: this.metadata.size,
    };
  }
}
