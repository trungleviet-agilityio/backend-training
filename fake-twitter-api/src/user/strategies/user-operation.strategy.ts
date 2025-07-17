/**
 * User operation strategy
 */

import { User } from '../../database/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserOperationStrategy {
  canUpdateUser(currentUser: User, targetUser: User): boolean;
  canViewUser(currentUser: User, targetUser: User): boolean;
  canDeleteUser(currentUser: User, targetUser: User): boolean;
  validateUpdateData(
    currentUser: User,
    targetUser: User,
    updateData: UpdateUserDto,
  ): boolean;
}
