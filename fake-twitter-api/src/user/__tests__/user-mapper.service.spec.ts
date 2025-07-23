/**
 * User mapper service unit tests
 */

import { UserMapperService } from '../services/user-mapper.service';
import { UserTestBuilder } from './mocks/user-test.builder';
import { UserStats } from '../interfaces/user.interface';

describe('UserMapperService', () => {
  let userMapperService: UserMapperService;

  beforeEach(() => {
    userMapperService = new UserMapperService();
  });

  const date = new Date('2024-01-01T00:00:00.000Z');

  describe('toUserProfileDto', () => {
    it('should map user to profile DTO correctly', () => {
      // Arrange
      const mockUser = UserTestBuilder.createMockUser({
        createdAt: date,
        updatedAt: date,
      });
      const mockStats: UserStats = {
        postsCount: 5,
        commentsCount: 10,
        followersCount: 0,
        followingCount: 0,
      };

      // Act
      const result = userMapperService.toUserProfileDto(mockUser, mockStats);

      // Assert
      expect(result).toEqual({
        uuid: mockUser.uuid,
        username: mockUser.username,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        bio: mockUser.bio,
        avatarUrl: mockUser.avatarUrl,
        role: { name: mockUser.role.name },
        stats: mockStats,
        createdAt: mockUser.createdAt.toISOString(),
      });
    });

    it('should handle null/undefined values gracefully', () => {
      // Arrange
      const mockUser = UserTestBuilder.createMockUser({
        bio: undefined,
        avatarUrl: undefined,
        createdAt: date,
        updatedAt: date,
      });
      const mockStats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        followersCount: 0,
        followingCount: 0,
      };

      // Act
      const result = userMapperService.toUserProfileDto(mockUser, mockStats);

      // Assert
      expect(result.bio).toBeUndefined();
      expect(result.avatarUrl).toBeUndefined();
    });

    it('should handle different user roles correctly', () => {
      // Arrange
      const adminUser = UserTestBuilder.createMockAdminUser({
        createdAt: date,
        updatedAt: date,
      });
      const moderatorUser = UserTestBuilder.createMockModeratorUser({
        createdAt: date,
        updatedAt: date,
      });
      const regularUser = UserTestBuilder.createMockUser({
        createdAt: date,
        updatedAt: date,
      });
      const mockStats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        followersCount: 0,
        followingCount: 0,
      };

      // Act
      const adminResult = userMapperService.toUserProfileDto(
        adminUser,
        mockStats,
      );
      const moderatorResult = userMapperService.toUserProfileDto(
        moderatorUser,
        mockStats,
      );
      const regularResult = userMapperService.toUserProfileDto(
        regularUser,
        mockStats,
      );

      // Assert
      expect(adminResult.role.name).toBe('admin');
      expect(moderatorResult.role.name).toBe('moderator');
      expect(regularResult.role.name).toBe('user');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty stats', () => {
      // Arrange
      const mockUser = UserTestBuilder.createMockUser({
        createdAt: date,
        updatedAt: date,
      });
      const emptyStats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        followersCount: 0,
        followingCount: 0,
      };

      // Act
      const result = userMapperService.toUserProfileDto(mockUser, emptyStats);

      // Assert
      expect(result.stats).toEqual(emptyStats);
    });

    it('should handle large stat numbers', () => {
      // Arrange
      const mockUser = UserTestBuilder.createMockUser({
        createdAt: date,
        updatedAt: date,
      });
      const largeStats: UserStats = {
        postsCount: 999999,
        commentsCount: 999999,
        followersCount: 999999,
        followingCount: 999999,
      };

      // Act
      const result = userMapperService.toUserProfileDto(mockUser, largeStats);

      // Assert
      expect(result.stats).toEqual(largeStats);
    });
  });

  describe('toUserPostDto', () => {
    it('should map post to user post DTO correctly', () => {
      // Arrange
      const mockPost = {
        uuid: 'post-uuid-123',
        content: 'Test post content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        likesCount: 5,
        commentsCount: 10,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      // Act
      const result = userMapperService.toUserPostDto(mockPost);

      // Assert
      expect(result).toEqual({
        uuid: mockPost.uuid,
        content: mockPost.content,
        author: {
          uuid: mockPost.author.uuid,
          username: mockPost.author.username,
          firstName: mockPost.author.firstName,
          lastName: mockPost.author.lastName,
          avatarUrl: mockPost.author.avatarUrl,
        },
        stats: {
          likesCount: mockPost.likesCount,
          commentsCount: mockPost.commentsCount,
        },
        createdAt: mockPost.createdAt.toISOString(),
      });
    });

    it('should handle post with zero stats', () => {
      // Arrange
      const mockPost = {
        uuid: 'post-uuid-123',
        content: 'Test post content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      // Act
      const result = userMapperService.toUserPostDto(mockPost);

      // Assert
      expect(result.stats.likesCount).toBe(0);
      expect(result.stats.commentsCount).toBe(0);
    });
  });

  describe('toUserCommentDto', () => {
    it('should map comment to user comment DTO correctly', () => {
      // Arrange
      const mockComment = {
        uuid: 'comment-uuid-123',
        content: 'Test comment content',
        post: {
          uuid: 'post-uuid-123',
          content: 'Test post content',
          author: {
            uuid: 'user-uuid-123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
        },
        likesCount: 3,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      // Act
      const result = userMapperService.toUserCommentDto(mockComment);

      // Assert
      expect(result).toEqual({
        uuid: mockComment.uuid,
        content: mockComment.content,
        post: {
          uuid: mockComment.post.uuid,
          content: mockComment.post.content,
          author: {
            uuid: mockComment.post.author.uuid,
            username: mockComment.post.author.username,
            firstName: mockComment.post.author.firstName,
            lastName: mockComment.post.author.lastName,
            avatarUrl: mockComment.post.author.avatarUrl,
          },
        },
        stats: {
          likesCount: mockComment.likesCount,
        },
        createdAt: mockComment.createdAt.toISOString(),
      });
    });

    it('should handle comment with zero likes', () => {
      // Arrange
      const mockComment = {
        uuid: 'comment-uuid-123',
        content: 'Test comment content',
        post: {
          uuid: 'post-uuid-123',
          content: 'Test post content',
          author: {
            uuid: 'user-uuid-123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
        },
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      // Act
      const result = userMapperService.toUserCommentDto(mockComment);

      // Assert
      expect(result.stats.likesCount).toBe(0);
    });
  });
});
