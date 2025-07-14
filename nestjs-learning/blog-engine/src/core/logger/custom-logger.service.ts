/**
 * Custom Logger Service
 * Provides enhanced logging with NestJS Logger compatibility
 * Supports structured logging and proper log levels
 * Follows NestJS Logger best practices
 */

import { Injectable, Logger, LoggerService } from '@nestjs/common';

export interface LogContext {
  requestId?: string;
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
  private readonly isProduction: boolean;
  private readonly logLevel: string;
  private readonly enableConsole: boolean;

  constructor(context?: string) {
    super(context || 'Application');
    this.isProduction = process.env.NODE_ENV === 'production';

    // Get logging configuration with fallbacks
    this.logLevel = (process.env.LOG_LEVEL || 'debug').toLowerCase();
    this.enableConsole = process.env.LOG_CONSOLE !== 'false';

    // Always enable console logging in development
    if (!this.isProduction) {
      (this.enableConsole as any) = true;
    }
  }

  /**
   * Create a new logger instance with specific context
   */
  static createWithContext(context: string): CustomLoggerService {
    return new CustomLoggerService(context);
  }

  /**
   * Set the logger context
   */
  setContext(context: string): void {
    (this as any).context = context;
  }

  /**
   * Enhanced log method with structured logging
   */
  log(message: any, context?: string | LogContext): void {
    if (!this.shouldLog('log')) return;

    if (typeof context === 'string') {
      super.log(message, context);
    } else if (context && typeof context === 'object') {
      const formattedMessage = this.formatLog('INFO', message, context);
      super.log(formattedMessage);
    } else {
      super.log(message);
    }
  }

  /**
   * Enhanced error method with stack trace and context
   */
  error(message: any, stack?: string | LogContext, context?: string): void {
    if (!this.shouldLog('error')) return;

    if (typeof stack === 'string') {
      super.error(message, stack, context);
    } else if (stack && typeof stack === 'object') {
      const formattedMessage = this.formatLog('ERROR', message, stack);
      super.error(formattedMessage);
    } else {
      super.error(message);
    }
  }

  /**
   * Enhanced warn method
   */
  warn(message: any, context?: string | LogContext): void {
    if (!this.shouldLog('warn')) return;

    if (typeof context === 'string') {
      super.warn(message, context);
    } else if (context && typeof context === 'object') {
      const formattedMessage = this.formatLog('WARN', message, context);
      super.warn(formattedMessage);
    } else {
      super.warn(message);
    }
  }

  /**
   * Enhanced debug method
   */
  debug(message: any, context?: string | LogContext): void {
    if (!this.shouldLog('debug')) return;

    if (typeof context === 'string') {
      super.debug(message, context);
    } else if (context && typeof context === 'object') {
      const formattedMessage = this.formatLog('DEBUG', message, context);
      super.debug(formattedMessage);
    } else {
      super.debug(message);
    }
  }

  /**
   * Enhanced verbose method
   */
  verbose(message: any, context?: string | LogContext): void {
    if (!this.shouldLog('verbose')) return;

    if (typeof context === 'string') {
      super.verbose(message, context);
    } else if (context && typeof context === 'object') {
      const formattedMessage = this.formatLog('VERBOSE', message, context);
      super.verbose(formattedMessage);
    } else {
      super.verbose(message);
    }
  }

  /**
   * Log request start with structured context
   */
  logRequestStart(
    method: string,
    url: string,
    requestId: string,
    context?: LogContext,
  ): void {
    this.log(`→ ${method} ${url}`, {
      ...context,
      requestId,
      component: 'HTTP',
      action: 'REQUEST_START',
      metadata: { method, url },
    });
  }

  /**
   * Log request completion with structured context
   */
  logRequestEnd(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    requestId: string,
    context?: LogContext,
  ): void {
    const status = statusCode >= 400 ? '❌' : '✅';
    const message = `${status} ${method} ${url} - ${statusCode} (${duration}ms)`;
    const logContext = {
      ...context,
      requestId,
      component: 'HTTP',
      action: 'REQUEST_END',
      metadata: { method, url, statusCode, duration },
    };

    if (statusCode >= 500) {
      this.error(message, logContext);
    } else if (statusCode >= 400) {
      this.warn(message, logContext);
    } else {
      this.log(message, logContext);
    }
  }

  /**
   * Log business operations with structured context
   */
  logOperation(
    operation: string,
    resourceId: string,
    context?: LogContext,
  ): void {
    this.log(`🔧 ${operation} → ${resourceId}`, {
      ...context,
      component: 'BUSINESS',
      action: operation,
      metadata: { resourceId },
    });
  }

  /**
   * Log security events with severity levels
   */
  logSecurityEvent(
    event: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    context?: LogContext,
  ): void {
    const severityEmoji = {
      LOW: '🔵',
      MEDIUM: '🟡',
      HIGH: '🟠',
      CRITICAL: '🔴',
    }[severity];

    const message = `${severityEmoji} Security: ${event} [${severity}]`;
    const logContext = {
      ...context,
      component: 'SECURITY',
      action: event,
      metadata: { severity },
    };

    if (severity === 'CRITICAL' || severity === 'HIGH') {
      this.error(message, logContext);
    } else {
      this.warn(message, logContext);
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(
    operation: string,
    duration: number,
    context?: LogContext,
  ): void {
    const emoji = duration > 1000 ? '⚠️' : '⚡';
    const message = `${emoji} Performance: ${operation} (${duration}ms)`;
    const logContext = {
      ...context,
      component: 'PERFORMANCE',
      action: operation,
      metadata: { duration, slow: duration > 1000 },
    };

    if (duration > 1000) {
      this.warn(message, logContext);
    } else {
      this.debug(message, logContext);
    }
  }

  /**
   * Format log message with structured data
   */
  private formatLog(
    level: string,
    message: string,
    context?: LogContext,
  ): string {
    if (!context) {
      return message;
    }

    // In development, use readable format with emojis and colors
    if (!this.isProduction) {
      const component = context.component ? `[${context.component}]` : '';
      const requestId = context.requestId
        ? `{${context.requestId.slice(0, 8)}}`
        : '';
      const userId = context.userId ? `(user:${context.userId})` : '';
      const metadata = context.metadata
        ? `${JSON.stringify(context.metadata)}`
        : '';

      return `${message} ${component}${requestId}${userId} ${metadata}`.trim();
    }

    // In production, use JSON format for log aggregation
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };

    return JSON.stringify(logData);
  }

  /**
   * Check if we should log based on configured level
   */
  private shouldLog(level: string): boolean {
    if (!this.enableConsole) {
      return false;
    }

    const levels = ['error', 'warn', 'log', 'debug', 'verbose'];
    const configuredLevel = this.logLevel.toLowerCase();
    const messageLevel = level.toLowerCase();

    const configuredIndex = levels.indexOf(configuredLevel);
    const messageIndex = levels.indexOf(messageLevel);

    // If configured level not found, default to 'debug'
    if (configuredIndex === -1) {
      return messageIndex <= 3; // debug level
    }

    return messageIndex <= configuredIndex;
  }
}
