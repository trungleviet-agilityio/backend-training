/**
 * Post operation factory
 */

import { Injectable } from '@nestjs/common';
import { UserRole } from '../../common/constants/roles.constant';
import {
  AdminPostStrategy,
  IPostOperationStrategy,
  ModeratorPostStrategy,
  RegularPostStrategy,
} from '../strategies';

@Injectable()
export class PostOperationFactory {
  /**
   * Constructor
   * @param adminStrategy - Admin post strategy
   * @param moderatorStrategy - Moderator post strategy
   * @param regularStrategy - Regular user post strategy
   */

  constructor(
    private readonly adminStrategy: AdminPostStrategy,
    private readonly moderatorStrategy: ModeratorPostStrategy,
    private readonly regularStrategy: RegularPostStrategy,
  ) {}

  createStrategy(roleName: string): IPostOperationStrategy {
    switch (roleName) {
      case UserRole.ADMIN:
        return this.adminStrategy;
      case UserRole.MODERATOR:
        return this.moderatorStrategy;
      case UserRole.USER:
      default:
        return this.regularStrategy;
    }
  }
}
