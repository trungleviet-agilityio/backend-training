/**
 * Post Mock Provider
 * Provides mock data and objects for post module tests
 * Following the Factory Pattern for test data creation
 */

import { Post } from '../../../database/entities/post.entity';
import { User } from '../../../database/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from '../../dto';
import { IPostOperationStrategy } from '../../strategies/post-operation.strategy';

export class PostMockProvider {
  /**
   * Create a mock post with default values
   */
  static createMockPost(overrides: Partial<Post> = {}): Post {
    const defaultPost = {
      uuid: 'post-uuid-123',
      content: 'Test post content',
      authorUuid: 'user-uuid-123',
      likesCount: 0,
      commentsCount: 0,
      isPublished: true,
      deleted: false,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      author: {
        uuid: 'user-uuid-123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: { name: 'user' },
      } as User,
      comments: [],
    };

    return { ...defaultPost, ...overrides } as Post;
  }

  /**
   * Create a mock user for post tests
   */
  static createMockUser(overrides: Partial<User> = {}): User {
    const defaultUser = {
      uuid: 'user-uuid-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: { name: 'user' },
    } as User;

    return { ...defaultUser, ...overrides } as User;
  }

  /**
   * Create a mock create post DTO
   */
  static createMockCreatePostDto(
    overrides: Partial<CreatePostDto> = {},
  ): CreatePostDto {
    const defaultDto: CreatePostDto = {
      content: 'Test post content',
      isPublished: true,
    };

    return { ...defaultDto, ...overrides };
  }

  /**
   * Create a mock update post DTO
   */
  static createMockUpdatePostDto(
    overrides: Partial<UpdatePostDto> = {},
  ): UpdatePostDto {
    const defaultDto: UpdatePostDto = {
      content: 'Updated post content',
      isPublished: true,
    };

    return { ...defaultDto, ...overrides };
  }

  /**
   * Create a mock post operation strategy
   */
  static createPostStrategy(): IPostOperationStrategy {
    return {
      canCreatePost: jest.fn().mockReturnValue(true) as jest.Mock,
      canViewPost: jest.fn().mockReturnValue(true) as jest.Mock,
      canUpdatePost: jest.fn().mockReturnValue(true) as jest.Mock,
      canDeletePost: jest.fn().mockReturnValue(true) as jest.Mock,
      validateCreateData: jest.fn().mockReturnValue(true) as jest.Mock,
      validateUpdateData: jest.fn().mockReturnValue(true) as jest.Mock,
    };
  }

  /**
   * Create mock paginated posts
   */
  static createMockPaginatedPosts(
    posts: Post[] = [],
    page = 1,
    limit = 10,
    total = 0,
  ) {
    return {
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
