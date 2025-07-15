/**
 * This file contains the entity for the auth password reset.
 */

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { User } from './user.entity';

@Entity('auth_password_resets')
export class AuthPasswordReset extends AbstractEntity<AuthPasswordReset> {
  @Column({ name: 'user_uuid' })
  userUuid: string;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  // Relations
  @ManyToOne(() => User, user => user.authPasswordResets)
  @JoinColumn({ name: 'user_uuid' })
  user: User;
}
