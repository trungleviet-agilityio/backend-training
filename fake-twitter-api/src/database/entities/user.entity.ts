/**
 * This file contains the entity for the user.
 */

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { AuthPasswordReset } from './auth-password-reset.entity';
import { AuthSession } from './auth-session.entity';
import { Role } from './role.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Entity('users')
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'role_uuid' })
  roleUuid: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  // Relations
  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_uuid' })
  role: Role;

  @OneToMany(() => AuthSession, session => session.user)
  authSessions: AuthSession[];

  @OneToMany(() => AuthPasswordReset, reset => reset.user)
  authPasswordResets: AuthPasswordReset[];

  // Content relationships
  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  constructor(entity: Partial<User> = {}) {
    super(entity);
    Object.assign(this, entity);
  }
}
