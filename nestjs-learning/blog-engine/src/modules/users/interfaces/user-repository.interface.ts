/*
This file is used to define the interfaces for the users module.
*/

import { IUser, ICreateUser, IUpdateUser } from './user.interface';

export interface IUserRepository {
  create(data: ICreateUser): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: string, data: IUpdateUser): Promise<IUser>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
} 