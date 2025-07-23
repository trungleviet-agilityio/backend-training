/**
 * This file contains the entity for the role.
 */

import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { User } from './user.entity';
import { UserRole } from '../../common/constants/roles.constant';

@Entity('roles')
export class Role extends AbstractEntity<Role> {
  @Column({ unique: true, default: UserRole.USER })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, any>;

  // Relations
  @OneToMany(() => User, user => user.role)
  users: User[];

  constructor(entity: Partial<Role> = {}) {
    super(entity);
    Object.assign(this, entity);
  }
}
