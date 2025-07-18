/**
 * This file contains the guard for the roles.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Check if user exists and has a role
    if (!user || !user.role) {
      throw new ForbiddenException(
        'User authentication required to access this resource',
      );
    }

    // Check if user has any of the required roles
    const userRoleName = user.role.name || user.role;
    const hasRequiredRole = requiredRoles.some(role => userRoleName === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. Your role: ${userRoleName}`,
      );
    }

    return true;
  }
}
