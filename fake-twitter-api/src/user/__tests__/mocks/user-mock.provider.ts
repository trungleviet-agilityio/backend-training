/**
 * User Mock Provider - Clean & Focused
 * Following AuthMockProvider pattern exactly
 */

import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { Comment } from '../../../database/entities/comment.entity';
import { UserService } from '../../services/user.service';
import { UserOperationFactory } from '../../factories/user-operation.factory';
import { UserMapperService } from '../../services/user-mapper.service';
import { IUserOperationStrategy } from '../../strategies/user-operation.strategy';

export class UserMockProvider {
  // Service Mocks
  static createUserService(): jest.Mocked<UserService> {
    return {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      getUserStats: jest.fn(),
      getUserPosts: jest.fn(),
      getUserComments: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
  }

  static createUserOperationFactory(): jest.Mocked<UserOperationFactory> {
    return {
      createStrategy: jest.fn(),
    } as unknown as jest.Mocked<UserOperationFactory>;
  }

  static createUserMapperService(): jest.Mocked<UserMapperService> {
    return {
      toUserProfileDto: jest.fn(),
      toUserPostDto: jest.fn(),
      toUserCommentDto: jest.fn(),
    } as unknown as jest.Mocked<UserMapperService>;
  }

  // Repository Mocks
  static createUserRepository(): jest.Mocked<Repository<User>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      softRemove: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<Repository<User>>;
  }

  static createPostRepository(): jest.Mocked<Repository<Post>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<Repository<Post>>;
  }

  static createCommentRepository(): jest.Mocked<Repository<Comment>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn(),
    } as unknown as jest.Mocked<Repository<Comment>>;
  }

  // Strategy Mock
  static createUserStrategy(): jest.Mocked<IUserOperationStrategy> {
    return {
      canUpdateUser: jest.fn(),
      canDeleteUser: jest.fn(),
      canViewUser: jest.fn(),
      validateUpdateData: jest.fn(),
    } as unknown as jest.Mocked<IUserOperationStrategy>;
  }

  // Test Data Helpers
  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      uuid: 'user-uuid-123',
      email: 'test@example.com',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: '$2b$12$hashedpassword',
      bio: 'Test user bio',
      avatarUrl: 'https://example.com/avatar.jpg',
      isActive: true,
      emailVerified: true,
      roleUuid: 'user-role-uuid',
      role: {
        uuid: 'user-role-uuid',
        name: 'user',
        description: 'Regular user',
        permissions: {},
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        updateUpdatedAt: jest.fn(),
      },
      authSessions: [],
      authPasswordResets: [],
      posts: [],
      comments: [],
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      deleted: false,
      updateUpdatedAt: jest.fn(),
      ...overrides,
    } as User;
  }

  static createMockPost(overrides: Partial<Post> = {}): Post {
    return {
      uuid: 'post-uuid-123',
      content: 'Test post content',
      authorUuid: 'user-uuid-123',
      likesCount: 0,
      commentsCount: 0,
      isPublished: true,
      author: this.createMockUser(),
      comments: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deleted: false,
      updateUpdatedAt: jest.fn(),
      ...overrides,
    } as Post;
  }

  static createMockComment(overrides: Partial<Comment> = {}): Comment {
    return {
      uuid: 'comment-uuid-123',
      content: 'Test comment content',
      authorUuid: 'user-uuid-123',
      postUuid: 'post-uuid-123',
      parentUuid: null,
      depthLevel: 0,
      likesCount: 0,
      author: this.createMockUser(),
      post: this.createMockPost(),
      parent: null,
      replies: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      deleted: false,
      updateUpdatedAt: jest.fn(),
      ...overrides,
    } as Comment;
  }
}
