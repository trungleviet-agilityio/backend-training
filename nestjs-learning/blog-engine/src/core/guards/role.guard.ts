/*
Role guard is used to check if user has the required role.
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY, USER_KEY, AUTHOR_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Check for specific role decorators
    const isAdmin = this.reflector.getAllAndOverride<boolean>(ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isUser = this.reflector.getAllAndOverride<boolean>(USER_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isAuthor = this.reflector.getAllAndOverride<boolean>(AUTHOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Check user role against required roles
    if (isAdmin && user.role === 'admin') return true;
    if (isUser && user.role === 'user') return true;
    if (isAuthor && user.role === 'author') return true;

    // Allow admin to access everything
    if (user.role === 'admin') return true;

    return false;
  }
}
