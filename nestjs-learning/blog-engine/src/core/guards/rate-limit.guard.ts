/*
Rate limit guard is used to define the rate limit guard for the application.
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

/*
RateLimitGuard is a guard that provides the rate limit functionality for the application.
*/
@Injectable()
export class RateLimitGuard implements CanActivate {
  private requestCounts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientId = this.getClientId(request);
    const now = Date.now();

    // Get or create client record
    const clientRecord = this.requestCounts.get(clientId) || {
      count: 0,
      resetTime: now + 60000, // 1 minute window
    };

    // Reset counter if window has passed
    if (now > clientRecord.resetTime) {
      clientRecord.count = 0;
      clientRecord.resetTime = now + 60000;
    }

    // Check rate limit
    if (clientRecord.count >= 100) {
      // 100 requests per minute
      throw new HttpException(
        {
          message: 'Rate limit exceeded',
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    clientRecord.count++;
    this.requestCounts.set(clientId, clientRecord);

    return true;
  }

  private getClientId(request: Request): string {
    // Use IP address as client identifier
    return request.ip || request.connection.remoteAddress || 'unknown';
  }
}
