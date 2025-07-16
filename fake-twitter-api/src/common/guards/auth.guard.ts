/**
 * @deprecated Use JwtAuthGuard from auth module instead
 * This guard is kept for backward compatibility but should not be used
 */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * @deprecated Use JwtAuthGuard from auth module instead
   */

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.warn('AuthGuard is deprecated. Use JwtAuthGuard from auth module instead.');
    return true;
  }
}
