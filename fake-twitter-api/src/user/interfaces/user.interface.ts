/**
 * User interfaces using Interface Segregation Principle
 */

import { User } from 'src/database/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Post } from 'src/database/entities/post.entity';
import { Comment } from 'src/database/entities/comment.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserService {
  findById(uuid: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  updateUserProfile(uuid: string, updateData: UpdateUserDto): Promise<User>;
  getUserStats(uuid: string): Promise<UserStats>;
  getUserPosts(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedPosts>;
  getUserComments(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedComments>;
}

export interface IUserRepository {
  findById(uuid: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  update(uuid: string, data: Partial<User>): Promise<User>;
  getUserStats(uuid: string): Promise<UserStats>;
  getUserPosts(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedPosts>;
  getUserComments(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedComments>;
}

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface PaginatedPosts {
  data: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedComments {
  data: Comment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
