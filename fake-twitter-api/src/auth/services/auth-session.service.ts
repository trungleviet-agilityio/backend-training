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
    // Check if session exists and is active before invalidating
    const session = await this.sessionRepository.findOne({
      where: { uuid: sessionId },
    });

    if (session && session.isActive) {
      await this.sessionRepository.update(sessionId, {
        isActive: false,
      });
    }
  }

  async invalidateAllUserSessions(userUuid: string): Promise<void> {
    await this.sessionRepository.update(
      { userUuid, isActive: true },
      { isActive: false },
    );
  }
}
