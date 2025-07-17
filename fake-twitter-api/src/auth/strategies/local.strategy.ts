/**
 * This file contains the local strategy for the auth.
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../services';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor
   *
   * @param authService - Auth service
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validate method required by PassportStrategy
   *
   * @param email - User email
   * @param password - User password
   * @returns User or null
   */
  async validate(email: string): Promise<User> {
    try {
      const user = await this.authService.validateUser(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
