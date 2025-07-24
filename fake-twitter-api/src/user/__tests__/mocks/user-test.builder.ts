/**
 * User Test Builder - Clean & Focused
 * Following AuthTestBuilder pattern exactly
 */

import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { Comment } from '../../../database/entities/comment.entity';
import { UserUpdatePayloadDto } from '../../dto/update-user.dto';
import {
  UserCommentDto,
  UserPostDto,
  UserProfileDto,
  UserStatsDto,
} from '../../dto/user.dto';
import { IJwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { TestDataFactory } from '../../../common/__tests__/test-utils';
import { Role } from '../../../database/entities/role.entity';
import {
  UserCommentsResponseDto,
  UserPostsResponseDto,
} from 'src/user/dto/user-response.dto';
import { PaginationMeta } from 'src/common/dto/api-response.dto';

export interface IUserTestScenario {
  currentUser?: User;
  targetUser?: User;
  userProfile?: UserProfileDto;
  userStats?: UserStatsDto;
  updateDto?: UserUpdatePayloadDto;
  paginatedPosts?: UserPostsResponseDto;
  paginatedComments?: UserCommentsResponseDto;
  jwtPayload?: IJwtPayload;
  error?: Error;
}

export class UserTestBuilder {
  private scenario: IUserTestScenario = {};

  // Static factory methods for backward compatibility
  static createMockUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser(overrides);
  }

  static createMockAdminUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser({
      ...overrides,
      role: { name: 'admin', uuid: 'admin-role-uuid' } as Role,
    });
  }

  static createMockModeratorUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser({
      ...overrides,
      role: { name: 'moderator', uuid: 'moderator-role-uuid' } as Role,
    });
  }

  static createMockUserWithRole(
    role: string,
    overrides: Partial<User> = {},
  ): User {
    return TestDataFactory.createUser({
      ...overrides,
      role: { name: role, uuid: `${role}-role-uuid` } as Role,
    });
  }

  withCurrentUser(user: User | Partial<User>): this {
    this.scenario.currentUser =
      'uuid' in user ? (user as User) : TestDataFactory.createUser(user);
    return this;
  }

  withTargetUser(user: User | Partial<User>): this {
    this.scenario.targetUser =
      'uuid' in user ? (user as User) : TestDataFactory.createUser(user);
    return this;
  }

  withUserProfile(profile: UserProfileDto | Partial<UserProfileDto>): this {
    this.scenario.userProfile = this.createUserProfileDto(profile);
    return this;
  }

  withUserStats(stats: UserStatsDto | Partial<UserStatsDto>): this {
    this.scenario.userStats = {
      postsCount: 0,
      commentsCount: 0,
      followersCount: 0,
      followingCount: 0,
      ...stats,
    };
    return this;
  }

  withUpdateDto(
    updateDto: UserUpdatePayloadDto | Partial<UserUpdatePayloadDto>,
  ): this {
    this.scenario.updateDto = {
      firstName: 'Updated First',
      lastName: 'Updated Last',
      bio: 'Updated bio',
      ...updateDto,
    };
    return this;
  }

  withPaginatedPosts(
    posts: Post[],
    page = 1,
    limit = 10,
    total?: number,
  ): this {
    return this;
  }

  withPaginatedComments(
    comments: Comment[],
    page = 1,
    limit = 10,
    total?: number,
  ): this {
    return this;
  }

  withJwtPayload(payload: IJwtPayload | Partial<IJwtPayload>): this {
    this.scenario.jwtPayload = {
      sub: 'user-uuid-123',
      email: 'test@example.com',
      username: 'testuser',
      role: 'user',
      permissions: {},
      sessionId: 'session-id-123',
      ...payload,
    };
    return this;
  }

  withError(error: Error): this {
    this.scenario.error = error;
    return this;
  }

  build(): IUserTestScenario {
    return this.scenario;
  }

  // Helper method to get User objects directly
  buildCurrentUser(): User {
    return this.scenario.currentUser || TestDataFactory.createUser();
  }

  buildTargetUser(): User {
    return this.scenario.targetUser || TestDataFactory.createUser();
  }

  private createUserProfileDto(
    partial: Partial<UserProfileDto>,
  ): UserProfileDto {
    return {
      uuid: 'user-uuid-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: {
        name: 'user',
      },
      stats: {
        postsCount: 0,
        commentsCount: 0,
      },
      ...partial,
    };
  }
}
