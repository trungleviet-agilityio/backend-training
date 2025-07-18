/**
 * User Response DTO Tests
 *
 * Tests for user response DTOs to ensure proper data structure
 */

import {
  UserProfileDto,
  UserPostDto,
  UserCommentDto,
} from '../../dto/user-response.dto';

describe('User Response DTOs', () => {
  describe('UserProfileDto', () => {
    it('should have correct structure', () => {
      // Arrange
      const profileDto: UserProfileDto = {
        uuid: 'user-uuid-123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        bio: 'Test bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: { name: 'user' },
        stats: {
          postsCount: 5,
          commentsCount: 10,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(profileDto.uuid).toBeDefined();
      expect(profileDto.username).toBeDefined();
      expect(profileDto.firstName).toBeDefined();
      expect(profileDto.lastName).toBeDefined();
      expect(profileDto.bio).toBeDefined();
      expect(profileDto.avatarUrl).toBeDefined();
      expect(profileDto.role).toBeDefined();
      expect(profileDto.stats).toBeDefined();
      expect(profileDto.createdAt).toBeDefined();
    });

    it('should handle optional fields', () => {
      // Arrange
      const profileDto: UserProfileDto = {
        uuid: 'user-uuid-123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        role: { name: 'user' },
        stats: {
          postsCount: 0,
          commentsCount: 0,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(profileDto.bio).toBeUndefined();
      expect(profileDto.avatarUrl).toBeUndefined();
    });
  });

  describe('UserPostDto', () => {
    it('should have correct structure', () => {
      // Arrange
      const postDto: UserPostDto = {
        uuid: 'post-uuid-123',
        content: 'Test post content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        stats: {
          likesCount: 5,
          commentsCount: 10,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(postDto.uuid).toBeDefined();
      expect(postDto.content).toBeDefined();
      expect(postDto.author).toBeDefined();
      expect(postDto.stats).toBeDefined();
      expect(postDto.createdAt).toBeDefined();
    });

    it('should handle author optional fields', () => {
      // Arrange
      const postDto: UserPostDto = {
        uuid: 'post-uuid-123',
        content: 'Test post content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        },
        stats: {
          likesCount: 0,
          commentsCount: 0,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(postDto.author.avatarUrl).toBeUndefined();
    });
  });

  describe('UserCommentDto', () => {
    it('should have correct structure', () => {
      // Arrange
      const commentDto: UserCommentDto = {
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
        stats: {
          likesCount: 3,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(commentDto.uuid).toBeDefined();
      expect(commentDto.content).toBeDefined();
      expect(commentDto.post).toBeDefined();
      expect(commentDto.stats).toBeDefined();
      expect(commentDto.createdAt).toBeDefined();
    });

    it('should handle nested post author optional fields', () => {
      // Arrange
      const commentDto: UserCommentDto = {
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
          },
        },
        stats: {
          likesCount: 0,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      // Assert
      expect(commentDto.post.author.avatarUrl).toBeUndefined();
    });
  });
});
