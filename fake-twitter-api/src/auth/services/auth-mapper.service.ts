/**
 * Auth mapper service
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { AuthRefreshTokenDto, AuthTokensWithUserDto } from '../dto';

@Injectable()
export class AuthMapperService {
  /**
   * Map to auth tokens with user
   *
   * @param user - User
   * @param tokens - Tokens
   * @returns Auth tokens with user
   */
  mapToAuthTokensWithUser(
    user: User,
    tokens: AuthRefreshTokenDto,
  ): AuthTokensWithUserDto {
    return {
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          name: user.role.name,
        },
      },
    };
  }

  /**
   * Map to auth refresh token
   *
   * @param tokens - Tokens
   * @returns Auth refresh token
   */
  mapToAuthRefreshToken(tokens: AuthRefreshTokenDto): AuthRefreshTokenDto {
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }
}
