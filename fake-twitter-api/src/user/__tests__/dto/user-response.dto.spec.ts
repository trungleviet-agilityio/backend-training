/**
 * User Response DTO Tests
 *
 * Tests for user response DTOs to ensure proper data structure
 */

import { UserProfileDto } from '../../dto/user.dto';

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
      };

      // Assert
      expect(profileDto.bio).toBeUndefined();
      expect(profileDto.avatarUrl).toBeUndefined();
    });
  });

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
      };

      // Assert
      expect(profileDto.bio).toBeUndefined();
      expect(profileDto.avatarUrl).toBeUndefined();
    });
  });

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
      };

      // Assert
      expect(profileDto.bio).toBeUndefined();
      expect(profileDto.avatarUrl).toBeUndefined();
    });
  });
});
