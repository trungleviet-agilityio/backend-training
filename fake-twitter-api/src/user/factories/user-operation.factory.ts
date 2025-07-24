/**
 * User operation factory
 */

import { Injectable } from '@nestjs/common';
import { UserRole } from '../../common/constants/roles.constant';
import { AdminUserStrategy } from '../strategies/user-admin.strategy';
import { ModeratorUserStrategy } from '../strategies/user-moderator.strategy';
import { RegularUserStrategy } from '../strategies/user-regular.strategy';
import { IUserOperationStrategy } from '../strategies/user-operation.strategy';

@Injectable()
export class UserOperationFactory {
  /**
   * Constructor
   * @param adminStrategy - Admin user strategy
   * @param moderatorStrategy - Moderator user strategy
   * @param regularStrategy - Regular user strategy
   */

  constructor(
    private readonly adminStrategy: AdminUserStrategy,
    private readonly moderatorStrategy: ModeratorUserStrategy,
    private readonly regularStrategy: RegularUserStrategy,
  ) {}

  createStrategy(roleName: string): IUserOperationStrategy {
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
