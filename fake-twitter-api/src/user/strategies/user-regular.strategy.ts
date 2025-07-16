/**
 * User regular strategy
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserOperationStrategy } from './user-operation.strategy';

@Injectable()
export class RegularUserStrategy implements IUserOperationStrategy {
  canUpdateUser(currentUser: User, targetUser: User): boolean {
    /**
     * Regular users can only update their own profile
     */

    return currentUser.uuid === targetUser.uuid;
  }

  canViewUser(currentUser: User, targetUser: User): boolean {
    /**
     * Regular users can view other users' profiles
     */

    return true;
  }

  canDeleteUser(currentUser: User, targetUser: User): boolean {
    /**
     * Regular users cannot delete other users
     */

    return false;
  }

  validateUpdateData(currentUser: User, targetUser: User, updateData: UpdateUserDto): boolean {
    /**
     * Regular users can only update their own profile fields
     */

    const allowedFields = ['firstName', 'lastName', 'bio', 'avatarUrl'];
    const updateFields = Object.keys(updateData);

    return updateFields.every(field => allowedFields.includes(field));
  }
}
