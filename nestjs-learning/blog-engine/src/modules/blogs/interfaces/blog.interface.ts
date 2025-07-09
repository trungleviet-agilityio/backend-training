/*
This file is used to define the interfaces for the blogs module.
*/

import { IUser } from '../../users/interfaces/user.interface';

export interface IBlog {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  tags: string[];
  viewCount: number;
  likeCount: number;
  authorId: string;
  author?: IUser;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isPublic: boolean;
  publish(): void;
  unpublish(): void;
}

export interface ICreateBlog {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
}

export interface IUpdateBlog {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
}

export interface IBlogResponse {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: Date;
  tags: string[];
  viewCount: number;
  likeCount: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

export interface IBlogFilters {
  includeDrafts?: boolean;
  authorId?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}
