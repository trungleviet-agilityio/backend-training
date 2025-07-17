/**
 * Moderator post operation strategy
 */

import { Injectable } from '@nestjs/common';
import { IPostOperationStrategy } from './post-operation.strategy';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { CreatePostDto, UpdatePostDto } from '../dto';

@Injectable()
export class ModeratorPostStrategy implements IPostOperationStrategy {
  canCreatePost(currentUser: User): boolean {
    /**
     * Moderator can create posts
     * @param currentUser - The current user
     * @returns true if the user can create a post
     */

    return true;
  }

  canViewPost(currentUser: User, post: Post): boolean {
    /**
     * Moderator can view any post
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can view the post
     */

    return true;
  }

  canUpdatePost(currentUser: User, post: Post): boolean {
    /**
     * Moderator can update their own posts or any post for moderation
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can update the post
     */

    return currentUser.uuid === post.authorUuid || true;
  }

  canDeletePost(currentUser: User, post: Post): boolean {
    /**
     * Moderator can delete their own posts or any post for moderation
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can delete the post
     */

    return currentUser.uuid === post.authorUuid || true;
  }

  validateCreateData(currentUser: User, createData: CreatePostDto): boolean {
    /**
     * Moderator can create any type of post
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
     * Moderator can update any field
     * @param currentUser - The current user
     * @param post - The post
     * @param updateData - The data to update the post
     * @returns true if the user can update the post
     */

    return true;
  }
}
