/**
 * Audit Service
 * Provides request-scoped audit logging functionality
 * Tracks operations performed during a request for compliance and debugging
 */

import { Injectable, Scope } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import {
  IAuditService,
  IAuditEntry,
} from '../interfaces/request-context.interface';
import { CustomLoggerService } from '../../../core/logger/custom-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class AuditService implements IAuditService {
  private readonly logger: CustomLoggerService;
  private readonly operations: IAuditEntry[] = [];

  constructor(
    private readonly requestContext: RequestContextService,
    logger: CustomLoggerService,
  ) {
    this.logger = logger;
    this.logger.setContext('AuditService');

    this.logger.debug('📋 Audit service created', {
      requestId: this.requestContext.getRequestId(),
      component: 'AUDIT',
      action: 'CREATE',
      metadata: {
        userId: this.requestContext.getUserId() || 'anonymous',
      },
    });
  }

  /**
   * Record a generic operation
   */
  recordOperation(operation: string, resourceId: string, details?: any): void {
    const entry: IAuditEntry = {
      operation,
      resourceId,
      userId: this.requestContext.getUserId(),
      requestId: this.requestContext.getRequestId(),
      timestamp: new Date(),
      details,
      ipAddress: this.requestContext.getMetadata('ipAddress'),
      userAgent: this.requestContext.getMetadata('userAgent'),
    };

    this.operations.push(entry);

    this.logger.logOperation(operation, resourceId, {
      requestId: entry.requestId,
      userId: entry.userId,
      metadata: {
        details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        totalOperations: this.operations.length,
      },
    });
  }

  /**
   * Record CREATE operations
   */
  recordCreate(resourceType: string, resourceId: string, data?: any): void {
    this.recordOperation(`CREATE_${resourceType.toUpperCase()}`, resourceId, {
      action: 'CREATE',
      resourceType,
      data: this.sanitizeData(data),
    });
  }

  /**
   * Record UPDATE operations
   */
  recordUpdate(resourceType: string, resourceId: string, changes?: any): void {
    this.recordOperation(`UPDATE_${resourceType.toUpperCase()}`, resourceId, {
      action: 'UPDATE',
      resourceType,
      changes: this.sanitizeData(changes),
    });
  }

  /**
   * Record DELETE operations
   */
  recordDelete(resourceType: string, resourceId: string): void {
    this.recordOperation(`DELETE_${resourceType.toUpperCase()}`, resourceId, {
      action: 'DELETE',
      resourceType,
    });
  }

  /**
   * Record ACCESS operations
   */
  recordAccess(
    resourceType: string,
    resourceId: string,
    accessType: 'READ' | 'LIST' | 'SEARCH' = 'READ',
    metadata?: any,
  ): void {
    this.recordOperation(`ACCESS_${resourceType.toUpperCase()}`, resourceId, {
      action: 'ACCESS',
      resourceType,
      accessType,
      metadata: this.sanitizeData(metadata),
    });
  }

  /**
   * Record authentication attempts
   */
  recordAuthentication(success: boolean, userId?: string, details?: any): void {
    const operation = success ? 'AUTH_SUCCESS' : 'AUTH_FAILURE';
    const severity = success ? 'LOW' : 'MEDIUM';

    this.recordOperation(operation, userId || 'anonymous', {
      action: 'AUTHENTICATION',
      success,
      details: this.sanitizeData(details),
    });

    // Log as security event
    this.logger.logSecurityEvent(
      `Authentication ${success ? 'successful' : 'failed'}`,
      severity,
      {
        requestId: this.requestContext.getRequestId(),
        userId,
        metadata: {
          success,
          details,
          ipAddress: this.requestContext.getMetadata('ipAddress'),
          userAgent: this.requestContext.getMetadata('userAgent'),
        },
      },
    );
  }

  /**
   * Record authorization checks
   */
  recordAuthorization(
    success: boolean,
    resource: string,
    action: string,
    userId?: string,
    details?: any,
  ): void {
    const operation = success ? 'AUTHZ_SUCCESS' : 'AUTHZ_FAILURE';
    const severity = success ? 'LOW' : 'HIGH';

    this.recordOperation(operation, resource, {
      action: 'AUTHORIZATION',
      success,
      resource,
      requiredAction: action,
      details: this.sanitizeData(details),
    });

    // Log as security event for failed authorization
    if (!success) {
      this.logger.logSecurityEvent(
        `Authorization failed for ${action} on ${resource}`,
        severity,
        {
          requestId: this.requestContext.getRequestId(),
          userId,
          metadata: {
            success,
            resource,
            requiredAction: action,
            details,
            ipAddress: this.requestContext.getMetadata('ipAddress'),
            userAgent: this.requestContext.getMetadata('userAgent'),
          },
        },
      );
    }
  }

  /**
   * Get all audit entries for this request (required by IAuditService)
   */
  getAuditEntries(): IAuditEntry[] {
    return [...this.operations];
  }

  /**
   * Get audit statistics for current request
   */
  getStatistics(): {
    totalOperations: number;
    operationTypes: Record<string, number>;
  } {
    const operationTypes: Record<string, number> = {};

    this.operations.forEach((op) => {
      operationTypes[op.operation] = (operationTypes[op.operation] || 0) + 1;
    });

    return {
      totalOperations: this.operations.length,
      operationTypes,
    };
  }

  /**
   * Generate audit summary for the request
   */
  private generateAuditSummary() {
    const stats = this.getStatistics();
    const userContext = this.requestContext.getUserContext();

    return {
      requestId: userContext.requestId,
      userId: userContext.userId,
      isAuthenticated: userContext.isAuthenticated,
      totalOperations: stats.totalOperations,
      operationTypes: stats.operationTypes,
      requestDuration:
        Date.now() - userContext.requestMetadata.timestamp.getTime(),
      ipAddress: this.requestContext.getMetadata('ipAddress'),
      userAgent: this.requestContext.getMetadata('userAgent'),
    };
  }

  /**
   * Flush audit log (typically called at end of request)
   */
  async flushAuditLog(): Promise<void> {
    if (this.operations.length === 0) {
      return;
    }

    try {
      // Log audit summary with structured logging
      const summary = this.generateAuditSummary();

      this.logger.log('Request audit summary completed', {
        requestId: this.requestContext.getRequestId(),
        userId: this.requestContext.getUserId(),
        component: 'AuditService',
        action: 'FLUSH_AUDIT',
        metadata: summary,
      });

      // In a real application, you would:
      // 1. Send to audit database
      // 2. Send to SIEM system
      // 3. Write to audit files
      // 4. Send to monitoring systems

      // Log each operation with structured format
      this.operations.forEach((entry) => {
        this.logger.log(`Audit entry: ${entry.operation}`, {
          requestId: entry.requestId,
          userId: entry.userId,
          component: 'AuditService',
          action: 'AUDIT_ENTRY',
          metadata: {
            operation: entry.operation,
            resourceId: entry.resourceId,
            timestamp: entry.timestamp.toISOString(),
            details: entry.details,
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
          },
        });
      });

      // Clear operations after flushing
      this.operations.length = 0;

      this.logger.debug('Audit log flushed successfully', {
        requestId: this.requestContext.getRequestId(),
        component: 'AuditService',
        action: 'FLUSH_COMPLETE',
        metadata: { entriesProcessed: summary.totalOperations },
      });
    } catch (error) {
      this.logger.error('Failed to flush audit log', {
        requestId: this.requestContext.getRequestId(),
        component: 'AuditService',
        action: 'FLUSH_ERROR',
        metadata: {
          error: error.message,
          stack: error.stack,
          operationCount: this.operations.length,
        },
      });
      throw error;
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ];

    if (typeof data === 'object') {
      const sanitized = { ...data };

      sensitiveFields.forEach((field) => {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      });

      return sanitized;
    }

    return data;
  }
}
