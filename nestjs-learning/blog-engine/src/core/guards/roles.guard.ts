/*
Roles guard is used to define the roles guard for the application.
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthorizationException } from '../exceptions';
import { RequestContextService } from '../../commons/context/services/request-context.service';
import { AuditService } from '../../commons/context/services/audit.service';

/*
RolesGuard is a guard that provides the roles functionality for the application.
Uses REQUEST scope for security isolation and audit tracking.
*/
@Injectable({ scope: Scope.REQUEST })
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];
    const resource = `${request.method} ${request.url}`;

    if (!user) {
      this.auditService.recordAuthorization(
        false,
        resource,
        'role_check',
        undefined,
        {
          reason: 'User not authenticated',
          requiredRoles,
        },
      );
      throw new AuthorizationException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      this.auditService.recordAuthorization(
        false,
        resource,
        'role_check',
        user.id,
        {
          reason: 'Insufficient role privileges',
          requiredRoles,
          userRole: user.role,
        },
      );

      throw new AuthorizationException(
        `User does not have required role. Required: ${requiredRoles.join(', ')}, User role: ${user.role}`,
      );
    }

    // Record successful authorization
    this.auditService.recordAuthorization(
      true,
      resource,
      'role_check',
      user.id,
      {
        requiredRoles,
        userRole: user.role,
      },
    );

    return true;
  }
}
