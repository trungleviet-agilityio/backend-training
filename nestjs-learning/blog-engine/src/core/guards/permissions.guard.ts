/*
Permissions guard is used to define the permissions guard for the application.
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthorizationException } from '../exceptions';

/*
PermissionsGuard is a guard that provides the permissions functionality for the application.
*/
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!user) {
      throw new AuthorizationException('User not authenticated');
    }

    // Check if user has required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions?.includes(permission)
    );

    if (!hasPermission) {
      throw new AuthorizationException(
        `User does not have required permissions. Required: ${requiredPermissions.join(', ')}`
      );
    }

    return true;
  }
}
