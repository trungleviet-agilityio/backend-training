/**
 * User moderator strategy
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { UserUpdatePayloadDto } from '../dto/update-user.dto';
import { IUserOperationStrategy } from './user-operation.strategy';

@Injectable()
export class ModeratorUserStrategy implements IUserOperationStrategy {
  canUpdateUser(currentUser: User, targetUser: User): boolean {
    /**
     * Moderators can only update their own profile
     */

    return currentUser.uuid === targetUser.uuid;
  }

  canViewUser(currentUser: User, targetUser: User): boolean {
    return true;
  }

  canDeleteUser(currentUser: User, targetUser: User): boolean {
    /**
     * Moderators cannot delete users
     */

    return false;
  }

  validateUpdateData(
    currentUser: User,
    targetUser: User,
    updateData: UserUpdatePayloadDto,
  ): boolean {
    /**
     * Moderators can only update their own profile fields
     */

    const allowedFields = ['firstName', 'lastName', 'bio', 'avatarUrl'];
    const updateFields = Object.keys(updateData);

    return updateFields.every(field => allowedFields.includes(field));
  }
}
