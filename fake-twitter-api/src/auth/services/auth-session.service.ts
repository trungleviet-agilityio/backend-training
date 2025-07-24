/**
 * Session Management Service - Handles session operations
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthSession } from '../../database/entities/auth-session.entity';

@Injectable()
export class AuthSessionService {
  constructor(
    @InjectRepository(AuthSession)
    private readonly sessionRepository: Repository<AuthSession>,
  ) {}

  async invalidateSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      isActive: false,
    });
  }

  async invalidateAllUserSessions(userUuid: string): Promise<void> {
    await this.sessionRepository.update(
      { userUuid, isActive: true },
      { isActive: false },
    );
  }
}
