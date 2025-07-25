/**
 * Token Management Service - Handles JWT operations
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '../../database/entities/user.entity';
import { AuthSession } from '../../database/entities/auth-session.entity';
import { AuthRefreshTokenDto, AuthTokensWithUserDto } from '../dto';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { DEFAULT_ROLE } from '../../common/constants/roles.constant';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthSession)
    private readonly sessionRepository: Repository<AuthSession>,
  ) {}

  async generateTokens(
    user: User,
    existingSessionId?: string,
  ): Promise<AuthTokensWithUserDto> {
    // Create session first if doesn't exist
    let sessionId = existingSessionId;
    if (!sessionId) {
      const session = await this.createSession(user.uuid);
      sessionId = session.uuid;
    }

    // Generate tokens with correct sessionId and unique timestamp
    const payload: IJwtPayload = {
      sub: user.uuid,
      email: user.email,
      username: user.username,
      role: user.role?.name || DEFAULT_ROLE,
      permissions: user.role?.permissions || {},
      sessionId,
      iat: Math.floor(Date.now() / 1000), // Add issued at timestamp for uniqueness
      jti: randomUUID(), // Add unique token ID for additional uniqueness
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.uuid, type: 'refresh', sessionId },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' },
    );

    // Update session with refresh token
    await this.updateSessionRefreshToken(sessionId, refreshToken);

    return {
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      user: {
        uuid: user.uuid,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: {
          name: user.role?.name || DEFAULT_ROLE,
        },
      },
    };
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ user: User; sessionId: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      if (payload.type !== 'refresh' || !payload.sessionId) {
        throw new UnauthorizedException('Invalid token format');
      }

      const session = await this.sessionRepository.findOne({
        where: { uuid: payload.sessionId, isActive: true },
        relations: ['user', 'user.role'],
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      const isValidToken = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return { user: session.user, sessionId: session.uuid };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async createSession(userUuid: string): Promise<AuthSession> {
    const session = this.sessionRepository.create({
      userUuid,
      refreshTokenHash: '', // Will be updated later
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    return await this.sessionRepository.save(session);
  }

  private async updateSessionRefreshToken(
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.sessionRepository.update(sessionId, {
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }
}
