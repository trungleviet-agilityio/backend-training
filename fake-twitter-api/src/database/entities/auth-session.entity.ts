/**
 * This file contains the entity for the auth session.
 */

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { User } from './user.entity';

@Entity('auth_sessions')
export class AuthSession extends AbstractEntity<AuthSession> {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'refresh_token_hash' })
  refreshTokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'device_info', nullable: true })
  deviceInfo?: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  // Relations
  @ManyToOne(() => User, user => user.authSessions)
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  constructor(entity: Partial<AuthSession> = {}) {
    super(entity);
    Object.assign(this, entity);
  }
}
