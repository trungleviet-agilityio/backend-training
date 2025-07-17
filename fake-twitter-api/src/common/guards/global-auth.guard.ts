/**
 * Global Authentication Guard
 * Handles authentication for all endpoints, respecting @Public() decorator
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  /**
   * Constructor
   * @param reflector - The reflector for the global auth guard
   * @param jwtAuthGuard - The JWT auth guard
   */

  constructor(
    private reflector: Reflector,
    private jwtAuthGuard: JwtAuthGuard,
  ) {}

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

    // Otherwise, use the JWT auth guard
    return this.jwtAuthGuard.canActivate(context) as boolean;
  }
}
