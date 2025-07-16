/**
 * Post operation strategy interface
 *
 * This interface defines the methods that a post operation strategy must implement.
 * It is used to determine if a user can perform a specific action on a post.
 *
 * @interface IPostOperationStrategy
 * @method canCreatePost - Determines if the user can create a post
 * @method canViewPost - Determines if the user can view a post
 * @method canUpdatePost - Determines if the user can update a post
 */

import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { CreatePostDto, UpdatePostDto } from '../dto';

export interface IPostOperationStrategy {
  canCreatePost(currentUser: User): boolean;
  canViewPost(currentUser: User, post: Post): boolean;
  canUpdatePost(currentUser: User, post: Post): boolean;
  canDeletePost(currentUser: User, post: Post): boolean;
  validateCreateData(currentUser: User, createData: CreatePostDto): boolean;
  validateUpdateData(currentUser: User, post: Post, updateData: UpdatePostDto): boolean;
}
