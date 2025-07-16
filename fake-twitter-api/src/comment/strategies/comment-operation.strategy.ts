/**
 * This file contains the strategy for the comment operation.
 */

import { User } from '../../database/entities/user.entity';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dto';

export interface ICommentOperationStrategy {
  canCreateComment(currentUser: User, postAuthorId: string): boolean;
  canUpdateComment(currentUser: User, comment: Comment): boolean;
  canDeleteComment(currentUser: User, comment: Comment): boolean;
  validateCreateData(currentUser: User, createData: CreateCommentDto): boolean;
  validateUpdateData(currentUser: User, comment: Comment, updateData: UpdateCommentDto): boolean;
}