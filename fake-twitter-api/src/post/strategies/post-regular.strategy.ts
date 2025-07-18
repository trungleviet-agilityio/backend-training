/**
 * Regular user post operation strategy
 */

import { Injectable } from '@nestjs/common';
import { IPostOperationStrategy } from './post-operation.strategy';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { CreatePostDto, UpdatePostDto } from '../dto';

@Injectable()
export class RegularPostStrategy implements IPostOperationStrategy {
  canCreatePost(currentUser: User): boolean {
    /**
     * Regular users can create posts
     * @param currentUser - The current user
     * @returns true if the user can create a post
     */

    console.log(
      'RegularPostStrategy.canCreatePost - currentUser:',
      currentUser,
    );
    console.log(
      'RegularPostStrategy.canCreatePost - currentUser.uuid:',
      currentUser?.uuid,
    );

    return true;
  }

  canViewPost(currentUser: User, post: Post): boolean {
    /**
     * Users can view published posts or their own posts
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can view the post
     */

    return post.isPublished || currentUser.uuid === post.authorUuid;
  }

  canUpdatePost(currentUser: User, post: Post): boolean {
    /**
     * Users can only update their own posts
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can update the post
     */

    return currentUser.uuid === post.authorUuid;
  }

  canDeletePost(currentUser: User, post: Post): boolean {
    /**
     * Users can only delete their own posts
     * @param currentUser - The current user
     * @param post - The post
     * @returns true if the user can delete the post
     */

    return currentUser.uuid === post.authorUuid;
  }

  validateCreateData(currentUser: User, createData: CreatePostDto): boolean {
    /**
     * Regular users can only create published posts
     * @param currentUser - The current user
     * @param createData - The data to create the post
     * @returns true if the user can create the post
     */

    return createData.isPublished !== false;
  }

  validateUpdateData(
    currentUser: User,
    post: Post,
    updateData: UpdatePostDto,
  ): boolean {
    /**
     * Regular users can update content and publishing status
     * @param currentUser - The current user
     * @param post - The post
     * @param updateData - The data to update the post
     * @returns true if the user can update the post
     */

    return true;
  }
}
