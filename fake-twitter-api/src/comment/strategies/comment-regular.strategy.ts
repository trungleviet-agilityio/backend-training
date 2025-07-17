/**
 * This file contains the strategy for the comment operation.
 */

import { Injectable } from '@nestjs/common';
import { ICommentOperationStrategy } from './comment-operation.strategy';
import { User } from '../../database/entities/user.entity';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dto';

@Injectable()
export class RegularCommentStrategy implements ICommentOperationStrategy {
  canCreateComment(currentUser: User, postAuthorId: string): boolean {
    /**
     * This method checks if the current user can create a comment.
     * @param currentUser - The current user.
     * @param postAuthorId - The ID of the post author.
     * @returns True if the current user can create a comment, false otherwise.
     */

    // Users should be able to comment on any post, including their own
    return !!currentUser;
  }

  canUpdateComment(currentUser: User, comment: Comment): boolean {
    /**
     * This method checks if the current user can update a comment.
     * @param currentUser - The current user.
     * @param comment - The comment to update.
     * @returns True if the current user can update a comment, false otherwise.
     */

    return comment.authorUuid === currentUser.uuid;
  }

  canDeleteComment(currentUser: User, comment: Comment): boolean {
    /**
     * This method checks if the current user can delete a comment.
     * @param currentUser - The current user.
     * @param comment - The comment to delete.
     * @returns True if the current user can delete a comment, false otherwise.
     */

    return comment.authorUuid === currentUser.uuid;
  }

  validateCreateData(currentUser: User, createData: CreateCommentDto): boolean {
    /**
     * This method validates the create data.
     * @param currentUser - The current user.
     * @param createData - The create data.
     * @returns True if the create data is valid, false otherwise.
     */

    return !!createData.content;
  }

  validateUpdateData(
    currentUser: User,
    comment: Comment,
    updateData: UpdateCommentDto,
  ): boolean {
    /**
     * This method validates the update data.
     * @param currentUser - The current user.
     * @param comment - The comment to update.
     * @param updateData - The update data.
     * @returns True if the update data is valid, false otherwise.
     */

    return comment.authorUuid === currentUser.uuid && !!updateData.content;
  }
}
