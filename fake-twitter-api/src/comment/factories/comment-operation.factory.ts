/**
 * This file contains the factory for the comment operation.
 */

import { Injectable } from '@nestjs/common';
import { 
  AdminCommentStrategy,
  ModeratorCommentStrategy,
  RegularCommentStrategy,
  ICommentOperationStrategy,
} from '../strategies';

@Injectable()
export class CommentOperationFactory {
  constructor(
    private readonly adminStrategy: AdminCommentStrategy,
    private readonly moderatorStrategy: ModeratorCommentStrategy,
    private readonly regularStrategy: RegularCommentStrategy,
  ) {}

  createStrategy(role: string): ICommentOperationStrategy {
    /**
     * This method creates the strategy for the comment operation.
     * @param role - The role of the user.
     * @returns The strategy for the comment operation.
     */

    switch (role) {
      case 'admin':
        return this.adminStrategy;
      case 'moderator':
        return this.moderatorStrategy;
      default:
        return this.regularStrategy;
    }
  }
}
