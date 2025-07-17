/**
 * This file contains the strategy for the comment operation.
 */

import { Injectable } from '@nestjs/common';
import { ICommentOperationStrategy } from './comment-operation.strategy';
import { User } from '../../database/entities/user.entity';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dto';

@Injectable()
export class AdminCommentStrategy implements ICommentOperationStrategy {
  canCreateComment(): boolean {
    return true;
  }
  canUpdateComment(): boolean {
    return true;
  }
  canDeleteComment(): boolean {
    return true;
  }
  validateCreateData(): boolean {
    return true;
  }
  validateUpdateData(): boolean {
    return true;
  }
}
