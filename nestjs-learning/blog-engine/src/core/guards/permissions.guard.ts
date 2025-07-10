/**
 * Permissions Guard
 * Provides permission-based authorization for the application
 * Uses REQUEST scope for security isolation and audit tracking
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Scope,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationException } from '../exceptions';
import { RequestContextService } from '../../commons/context/services/request-context.service';
import { AuditService } from '../../commons/context/services/audit.service';
import { IRequest } from '../../commons/interfaces/common.interface';

interface IUserWithPermissions {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

@Injectable({ scope: Scope.REQUEST })
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<IRequest>();
    const user = request.user as IUserWithPermissions | undefined;
    const resource = `${request.method} ${request.url}`;

    if (!user) {
      this.auditService.recordAuthorization(
        false,
        resource,
        'permission_check',
        undefined,
        {
          reason: 'User not authenticated',
          requiredPermissions,
        },
      );
      throw new AuthorizationException('User not authenticated');
    }

    // Check if user has required permissions
    const userPermissions = user.permissions || [];
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      this.auditService.recordAuthorization(
        false,
        resource,
        'permission_check',
        user.id,
        {
          reason: 'Insufficient permissions',
          requiredPermissions,
          userPermissions,
        },
      );

      throw new AuthorizationException(
        `User does not have required permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    // Record successful authorization
    this.auditService.recordAuthorization(
      true,
      resource,
      'permission_check',
      user.id,
      {
        requiredPermissions,
        userPermissions,
      },
    );

    return true;
  }
}
