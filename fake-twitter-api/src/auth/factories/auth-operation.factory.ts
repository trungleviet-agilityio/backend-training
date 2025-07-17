/**
 * Auth operation factory
 */

import { Inject, Injectable } from '@nestjs/common';
import { IAuthOperationStrategy } from '../strategies/auth-operation.strategy';
import { JwtAuthStrategy } from '../strategies/auth-jwt.strategy';

export enum AuthProvider {
  JWT = 'jwt',
  AUTH0 = 'auth0', // Future implementation
  // Add more providers as needed
}

@Injectable()
export class AuthOperationFactory {
  constructor(
    @Inject('JWT_AUTH_STRATEGY') private readonly jwtStrategy: JwtAuthStrategy,
    // private readonly auth0Strategy: Auth0AuthStrategy, // Future implementation
  ) {}

  createStrategy(
    provider: AuthProvider = AuthProvider.JWT,
  ): IAuthOperationStrategy {
    switch (provider) {
      case AuthProvider.JWT:
        return this.jwtStrategy;
      case AuthProvider.AUTH0:
        // return this.auth0Strategy; // Future implementation
        throw new Error('Auth0 strategy not implemented yet');
      default:
        return this.jwtStrategy;
    }
  }
}
