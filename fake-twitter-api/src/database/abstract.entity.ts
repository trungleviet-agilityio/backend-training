/**
 * This file is used to create an abstract class for the base entity.
 */

import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * This class is used to create a base entity that all other entities will inherit from.
 * It is used to create a base entity that all other entities will inherit from.
 */
export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Soft delete
  @Column({ name: 'deleted', type: 'boolean', default: false })
  deleted: boolean;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }

  // Trigger auto update updatedAt on update
  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
