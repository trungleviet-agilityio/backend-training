/**
 * User Test Builder - Clean & Focused
 * Following AuthTestBuilder pattern exactly
 */

import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { Comment } from '../../../database/entities/comment.entity';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserProfileDto } from '../../dto/user-response.dto';
import {
  UserStats,
  PaginatedPosts,
  PaginatedComments,
} from '../../interfaces/user.interface';
import { IJwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { TestDataFactory } from '../../../common/__tests__/test-utils';

export interface IUserTestScenario {
  currentUser?: User;
  targetUser?: User;
  userProfile?: UserProfileDto;
  userStats?: UserStats;
  updateDto?: UpdateUserDto;
  paginatedPosts?: PaginatedPosts;
  paginatedComments?: PaginatedComments;
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
      role: { name: 'admin', uuid: 'admin-role-uuid' } as any,
    });
  }

  static createMockModeratorUser(overrides: Partial<User> = {}): User {
    return TestDataFactory.createUser({
      ...overrides,
      role: { name: 'moderator', uuid: 'moderator-role-uuid' } as any,
    });
  }

  static createMockUserWithRole(
    role: string,
    overrides: Partial<User> = {},
  ): User {
    return TestDataFactory.createUser({
      ...overrides,
      role: { name: role, uuid: `${role}-role-uuid` } as any,
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

  withUserStats(stats: UserStats | Partial<UserStats>): this {
    this.scenario.userStats = {
      postsCount: 0,
      commentsCount: 0,
      followersCount: 0,
      followingCount: 0,
      ...stats,
    };
    return this;
  }

  withUpdateDto(updateDto: UpdateUserDto | Partial<UpdateUserDto>): this {
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
    this.scenario.paginatedPosts = {
      data: posts,
      meta: {
        page,
        limit,
        total: total ?? posts.length,
        totalPages: Math.ceil((total ?? posts.length) / limit),
      },
    };
    return this;
  }

  withPaginatedComments(
    comments: Comment[],
    page = 1,
    limit = 10,
    total?: number,
  ): this {
    this.scenario.paginatedComments = {
      data: comments,
      meta: {
        page,
        limit,
        total: total ?? comments.length,
        totalPages: Math.ceil((total ?? comments.length) / limit),
      },
    };
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
      createdAt: '2024-01-01',
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
