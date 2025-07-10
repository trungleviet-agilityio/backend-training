/*
This file is used to define the interfaces for the users module.
*/

import { IBlog } from '../../blogs/interfaces/blog.interface';

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  blogs?: IBlog[];
  fullName: string;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IUpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

export interface UsersModuleOptions {
  enableValidation?: boolean;
  enableCaching?: boolean;
  pagination?: {
    defaultLimit: number;
    maxLimit: number;
  };
  features?: {
    enableProfile?: boolean;
    enableAvatar?: boolean;
  };
}
