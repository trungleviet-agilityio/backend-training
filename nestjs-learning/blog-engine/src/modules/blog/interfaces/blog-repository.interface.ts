/*
This file is used to define the interfaces for the blogs module.
*/

import {
  IBlog,
  ICreateBlog,
  IUpdateBlog,
  IBlogFilters,
} from './blog.interface';

export interface IBlogRepository {
  create(data: ICreateBlog, authorId: string): Promise<IBlog>;
  findById(id: string, includeDrafts?: boolean): Promise<IBlog | null>;
  findAll(filters?: IBlogFilters): Promise<IBlog[]>;
  findByAuthor(authorId: string, includeDrafts?: boolean): Promise<IBlog[]>;
  update(id: string, data: IUpdateBlog, authorId: string): Promise<IBlog>;
  delete(id: string, authorId: string): Promise<void>;
  publish(id: string, authorId: string): Promise<IBlog>;
  unpublish(id: string, authorId: string): Promise<IBlog>;
  incrementViewCount(id: string): Promise<void>;
  incrementLikeCount(id: string): Promise<void>;
}
