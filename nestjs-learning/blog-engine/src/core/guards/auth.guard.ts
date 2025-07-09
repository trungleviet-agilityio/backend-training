/*
Auth guard is used to define the authentication guard for the application.
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import { MissingTokenException, InvalidTokenException } from '../exceptions';
import { IJwtPayload } from '../../shared/interfaces/jwt-payload.interface';

/*
AuthGuard is a guard that provides the authentication functionality for the application.
*/
@Injectable()
export class AuthGuard implements CanActivate {
  // Remove the constructor dependency
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new MissingTokenException();
    }

    try {
      // Validate token and get user
      const user = await this.validateToken(token);

      // Attach user to request for use in controllers
      request['user'] = user;

      return true;
    } catch (error) {
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
        role: 'admin' 
      };
    }
    throw new Error('Invalid token');
  }
}
