/*
Roles guard is used to define the roles guard for the application.
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
RolesGuard is a guard that provides the roles functionality for the application.
*/
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

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

    if (!user) {
      throw new AuthorizationException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new AuthorizationException(
        `User does not have required role. Required: ${requiredRoles.join(', ')}, User role: ${user.role}`
      );
    }

    return true;
  }
}
