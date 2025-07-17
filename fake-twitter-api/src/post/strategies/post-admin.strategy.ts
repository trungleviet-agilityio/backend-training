/**
 * Admin post operation strategy
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { IPostOperationStrategy } from './post-operation.strategy';

@Injectable()
export class AdminPostStrategy implements IPostOperationStrategy {
  canCreatePost(currentUser: User): boolean {
    /**
     * Admin can create posts
     * @param currentUser - The current user
     * @returns true if the user can create a post
     */

    return true;
  }

  canViewPost(currentUser: User, post: Post): boolean {
    /**
     * Admin can view any post
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can view the post
     */

    return true;
  }

  canUpdatePost(currentUser: User, post: Post): boolean {
    /**
     * Admin can update any post
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can update the post
     */

    return true;
  }

  canDeletePost(currentUser: User, post: Post): boolean {
    /**
     * Admin can delete any post
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can delete the post
     */

    return true;
  }

  validateCreateData(currentUser: User, createData: CreatePostDto): boolean {
    /**
     * Admin can create any type of post
     * @param currentUser - The current user
     * @param createData - The data to create the post
     * @returns true if the user can create the post
     */

    return true;
  }

  validateUpdateData(
    currentUser: User,
    post: Post,
    updateData: UpdatePostDto,
  ): boolean {
    /**
     * Admin can update any field
     * @param currentUser - The current user
     * @param post - The post
     * @param updateData - The data to update the post
     * @returns true if the user can update the post
     */

    return true;
  }
}
