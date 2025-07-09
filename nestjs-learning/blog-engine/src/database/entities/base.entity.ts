/*
This file is used to define the base entity for the database module.
*/

import { 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  DeleteDateColumn 
} from 'typeorm';

/*
BaseEntity is a base entity that provides the base entity functionality for the application.
*/
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
