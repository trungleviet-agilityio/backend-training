/**
 * Audit Flush Interceptor
 * Automatically flushes audit logs at the end of each request
 * This ensures all audit entries are properly logged even if the request fails
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Scope,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';
import { RequestContextService } from '../services/request-context.service';
import { UserSpecificCacheService } from '../services/user-cache.service';
import { IRequest, IError } from '../../interfaces/common.interface';

@Injectable({ scope: Scope.REQUEST })
export class AuditFlushInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditFlushInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly requestContext: RequestContextService,
    private readonly userCache: UserSpecificCacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<IRequest>();
    const requestId = this.requestContext?.getRequestId() || 'unknown';

    return next.handle().pipe(
      tap(() => {
        // Request completed successfully
        this.logger.debug(`Request ${requestId} completed successfully`);
      }),
      catchError((error: IError) => {
        // Request failed - record security event if it's an auth/authz error
        this.recordSecurityEvent(error, request);

        this.logger.error(`Request ${requestId} failed:`, error.message);
        return throwError(() => error);
      }),
      finalize(() => {
        // This runs regardless of success or failure
        void this.cleanupAndFlush(requestId, request);
      }),
    );
  }

  /**
   * Handle cleanup and flush operations asynchronously
   */
  private async cleanupAndFlush(
    requestId: string,
    request: IRequest,
  ): Promise<void> {
    try {
      // Only proceed if services are available
      if (!this.auditService || !this.requestContext || !this.userCache) {
        this.logger.warn('One or more required services are not available');
        return;
      }

      // Cleanup expired cache entries
      const expiredCount = this.userCache.cleanupExpired();
      if (expiredCount > 0) {
        this.logger.debug(`Cleaned up ${expiredCount} expired cache entries`);
      }

      // Log cache statistics for debugging
      const cacheStats = this.userCache.getStatistics();
      this.requestContext.setMetadata('cacheStats', cacheStats);

      // Flush audit logs
      await this.auditService.flushAuditLog();

      // Log final request context summary
      this.logRequestSummary(request);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        `Failed to flush audit logs for request ${requestId}:`,
        errorMessage,
      );
    }
  }

  /**
   * Record security events for failed requests
   */
  private recordSecurityEvent(error: IError, request: IRequest): void {
    try {
      if (!this.auditService) {
        return;
      }

      const errorName = error.constructor.name;
      const severity = this.getSeverityLevel(errorName);

      if (severity) {
        this.auditService.recordOperation(
          `SECURITY_${errorName}`,
          request.url || '',
          {
            severity,
            message: error.message || 'Unknown error',
            statusCode: error.status || 500,
            path: request.url || '',
            method: request.method || 'UNKNOWN',
            userAgent: request.headers?.['user-agent'] || 'Unknown',
            ipAddress: request.ip || 'Unknown',
          },
        );
      }
    } catch (auditError) {
      const errorMessage =
        auditError instanceof Error
          ? auditError.message
          : 'Unknown audit error';
      this.logger.error('Failed to record security event:', errorMessage);
    }
  }

  /**
   * Determine severity level based on error type
   */
  private getSeverityLevel(
    errorName: string,
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null {
    const severityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> =
      {
        // Authentication errors
        UnauthorizedException: 'MEDIUM',
        MissingTokenException: 'MEDIUM',
        InvalidTokenException: 'HIGH',

        // Authorization errors
        ForbiddenException: 'MEDIUM',
        AuthorizationException: 'MEDIUM',

        // Security-related errors
        TooManyRequestsException: 'HIGH',
        BadRequestException: 'LOW',

        // Critical system errors
        InternalServerErrorException: 'CRITICAL',
        ServiceUnavailableException: 'CRITICAL',
      };

    return severityMap[errorName] || null;
  }

  /**
   * Log comprehensive request summary
   */
  private logRequestSummary(request: IRequest): void {
    try {
      if (!this.requestContext || !this.auditService || !this.userCache) {
        this.logger.warn('Cannot log request summary - services not available');
        return;
      }

      const context = this.requestContext.getUserContext();
      const auditStats = this.auditService.getStatistics();
      const cacheStats = this.userCache.getStatistics();

      const summary = {
        requestId: context.requestId,
        userId: context.userId,
        isAuthenticated: context.isAuthenticated,
        method: request.method || 'UNKNOWN',
        url: request.url || '',
        userAgent: request.headers?.['user-agent'] || 'Unknown',
        duration: Date.now() - context.requestMetadata.timestamp.getTime(),
        auditOperations: auditStats.totalOperations,
        cacheHitRate: cacheStats.hitRate,
        cacheSize: cacheStats.userCacheSize,
      };

      this.logger.log(`Request Summary:`, summary);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to log request summary:', errorMessage);
    }
  }
}
