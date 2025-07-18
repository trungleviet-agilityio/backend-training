/**
 * Global Authentication Guard
 * Handles authentication for all endpoints, respecting @Public() decorator
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  /**
   * Constructor
   * @param reflector - The reflector for the global auth guard
   */

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    /**
     * Can activate
     * @param context - The execution context
     * @returns boolean
     */

    // Check if the endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If public, allow access without authentication
    if (isPublic) {
      return true;
    }

    // For non-public endpoints, check if user exists in request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user, authentication is required
    if (!user) {
      return false; // This will trigger 401 Unauthorized
    }

    return true;
  }
}
