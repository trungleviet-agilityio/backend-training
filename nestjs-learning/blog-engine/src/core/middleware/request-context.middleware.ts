/**
 * Request Context Middleware
 * Captures and stores request metadata in RequestContextService
 * Provides request-scoped context for logging and audit purposes
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../../commons/context/services/request-context.service';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly requestContext: RequestContextService,
    private readonly configService: ConfigService,
  ) {
    this.logger = CustomLoggerService.createWithContext(
      'RequestContextMiddleware',
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Set request start time for performance tracking
    this.requestContext.setMetadata('requestStartTime', new Date());

    // Capture request metadata
    this.requestContext.setRequestMetadata({
      timestamp: new Date(),
      path: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      correlationId:
        (req.headers['x-correlation-id'] as string) ||
        this.requestContext.getRequestId(),
    });

    // Store additional metadata
    this.requestContext.setMetadata(
      'ipAddress',
      req.ip || req.connection.remoteAddress,
    );
    this.requestContext.setMetadata('userAgent', req.headers['user-agent']);
    this.requestContext.setMetadata(
      'correlationId',
      req.headers['x-correlation-id'] || this.requestContext.getRequestId(),
    );
    this.requestContext.setMetadata('referer', req.headers.referer);
    this.requestContext.setMetadata('origin', req.headers.origin);

    // Add correlation ID to response headers for tracing
    res.setHeader(
      'X-Correlation-ID',
      this.requestContext.getMetadata('correlationId'),
    );
    res.setHeader('X-Request-ID', this.requestContext.getRequestId());

    // Log request start with structured logging
    this.logger.logRequestStart(
      req.method,
      req.url,
      this.requestContext.getRequestId(),
      {
        component: 'RequestContextMiddleware',
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          correlationId: this.requestContext.getMetadata('correlationId'),
        },
      },
    );

    // Store reference for response cleanup
    const requestContextRef = this.requestContext;
    const loggerRef = this.logger;

    // Clean up response handling
    const originalSend = res.send;
    res.send = function (data) {
      try {
        // Log request completion with structured logging
        const startTime = requestContextRef.getMetadata('requestStartTime');
        if (startTime) {
          const duration = Date.now() - new Date(startTime).getTime();
          loggerRef.logRequestEnd(
            req.method,
            req.url,
            res.statusCode,
            duration,
            requestContextRef.getRequestId(),
            {
              component: 'RequestContextMiddleware',
              metadata: {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip || req.connection.remoteAddress,
                responseSize: data ? Buffer.byteLength(data).toString() : '0',
              },
            },
          );
        }
      } catch (error) {
        loggerRef.warn('Error in response logging', {
          component: 'RequestContextMiddleware',
          metadata: { error: error.message },
        });
      }

      return originalSend.call(this, data);
    };

    next();
  }
}
