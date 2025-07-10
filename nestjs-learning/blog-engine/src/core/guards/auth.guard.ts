/*
Auth guard is used to define the authentication guard for the application.
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Request } from 'express';
import { MissingTokenException, InvalidTokenException } from '../exceptions';
import { IJwtPayload } from '../../shared/interfaces/jwt-payload.interface';
import { RequestContextService } from '../../commons/context/services/request-context.service';
import { AuditService } from '../../commons/context/services/audit.service';

/*
AuthGuard is a guard that provides the authentication functionality for the application.
Uses REQUEST scope for security isolation and user context tracking.
*/
@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
  private currentUser?: IJwtPayload;

  constructor(
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // Set request metadata for audit
    this.requestContext.setRequestMetadata({
      path: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ipAddress: request.ip || request.connection.remoteAddress,
    });

    if (!token) {
      this.auditService.recordAuthentication(false, undefined, {
        reason: 'Missing token',
        path: request.url,
      });
      throw new MissingTokenException();
    }

    try {
      // Validate token and get user
      const user = await this.validateToken(token);
      this.currentUser = user;

      // Set user context for this request
      this.requestContext.setUserId(user.id);
      this.requestContext.setMetadata('userRole', user.role);
      this.requestContext.setMetadata('userEmail', user.email);

      // Attach user to request for use in controllers
      request['user'] = user;

      // Record successful authentication
      this.auditService.recordAuthentication(true, user.id, {
        username: user.username,
        role: user.role,
        path: request.url,
      });

      return true;
    } catch (error) {
      this.auditService.recordAuthentication(false, undefined, {
        reason: 'Invalid token',
        error: error.message,
        path: request.url,
      });
      throw new InvalidTokenException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string): Promise<IJwtPayload> {
    // Simple token validation without AuthsService
    if (token === '1234567890') {
      return {
        sub: '1',
        id: '1',
        email: 'admin@example.com',
        username: 'admin',
        role: 'admin',
      };
    }
    throw new Error('Invalid token');
  }

  /**
   * Get the current user for this request
   */
  getCurrentUser(): IJwtPayload | undefined {
    return this.currentUser;
  }

  /**
   * Check if the current user has a specific role
   */
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Check if the current user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
