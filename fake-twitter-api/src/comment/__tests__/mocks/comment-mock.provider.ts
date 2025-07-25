/**
 * Comment Mock Provider - Clean & Focused
 * Following UserMockProvider pattern exactly
 */

import { Repository } from 'typeorm';
import { Comment } from '../../../database/entities/comment.entity';
import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { CommentService } from '../../services/comment.service';
import { CommentMapperService } from '../../services/comment-mapper.service';
import { CommentOperationFactory } from '../../factories/comment-operation.factory';
import { ICommentOperationStrategy } from '../../strategies/comment-operation.strategy';

export class CommentMockProvider {
  // Service Mocks
  static createCommentService(): jest.Mocked<CommentService> {
    return {
      findById: jest.fn(),
      getPostComments: jest.fn(),
      getCommentReplies: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
      deleteComment: jest.fn(),
    } as unknown as jest.Mocked<CommentService>;
  }

  static createCommentMapperService(): jest.Mocked<CommentMapperService> {
    return {
      toCommentDto: jest.fn(),
      toCommentDtoList: jest.fn(),
    } as unknown as jest.Mocked<CommentMapperService>;
  }

  static createCommentOperationFactory(): jest.Mocked<CommentOperationFactory> {
    return {
      createStrategy: jest.fn(),
    } as unknown as jest.Mocked<CommentOperationFactory>;
  }

  // Repository Mocks
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

  static createUserRepository(): jest.Mocked<Repository<User>> {
    return {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  // Strategy Mock
  static createCommentStrategy(): jest.Mocked<ICommentOperationStrategy> {
    return {
      canCreateComment: jest.fn(),
      canUpdateComment: jest.fn(),
      canDeleteComment: jest.fn(),
      canViewComment: jest.fn(),
      validateCreateData: jest.fn(),
      validateUpdateData: jest.fn(),
    } as unknown as jest.Mocked<ICommentOperationStrategy>;
  }

  // Test Data Helpers
  static createMockComment(overrides: Partial<Comment> = {}): Comment {
    return {
      uuid: 'comment-uuid-123',
      content: 'Test comment content',
      authorUuid: 'user-uuid-123',
      postUuid: 'post-uuid-123',
      parentUuid: null,
      depthLevel: 0,
      likesCount: 0,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      author: {
        uuid: 'user-uuid-123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: { name: 'user' },
      } as User,
      post: {
        uuid: 'post-uuid-123',
        title: 'Test Post',
        content: 'Test post content',
        authorUuid: 'user-uuid-123',
      } as unknown as Post,
      replies: [],
      ...overrides,
    } as Comment;
  }

  static createMockUser(overrides: Partial<User> = {}): User {
    return {
      uuid: 'user-uuid-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      role: { name: 'user' },
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      ...overrides,
    } as User;
  }

  static createMockPost(overrides: Partial<Post> = {}): Post {
    return {
      uuid: 'post-uuid-123',
      title: 'Test Post',
      content: 'Test post content',
      authorUuid: 'user-uuid-123',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      ...overrides,
    } as Post;
  }
}
