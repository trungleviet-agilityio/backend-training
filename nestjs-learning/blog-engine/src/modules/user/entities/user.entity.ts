/*
This file is used to define the entity for the users module.
*/

import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Blog } from '../../blog/entities/blog.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Exclude password from serialized output
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
