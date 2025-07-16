/**
 * User admin strategy
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserOperationStrategy } from './user-operation.strategy';

@Injectable()
export class AdminUserStrategy implements IUserOperationStrategy {
  canUpdateUser(currentUser: User, targetUser: User): boolean {
    /**
     * Admins can update any user
     */

    return currentUser.role.name === 'admin' || currentUser.uuid === targetUser.uuid;
  }

  canViewUser(currentUser: User, targetUser: User): boolean {
    /**
     * Admins can view any user
     */

    return true;
  }

  canDeleteUser(currentUser: User, targetUser: User): boolean {
    /**
     * Admins can delete any user
     */

    return currentUser.role.name === 'admin' && currentUser.uuid !== targetUser.uuid;
  }

  validateUpdateData(currentUser: User, targetUser: User, updateData: UpdateUserDto): boolean {
    /**
     * Admins can update any field
     */

    return true;
  }
}
