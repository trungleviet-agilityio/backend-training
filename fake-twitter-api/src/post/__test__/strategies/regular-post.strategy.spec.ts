/**
 * Regular Post Strategy Tests
 *
 * Tests the RegularPostStrategy class
 */

import { RegularPostStrategy } from '../../strategies/post-regular.strategy';
import { PostMockProvider } from '../mocks/post-mock.provider';
import { UpdatePostDto } from '../../dto';

describe('RegularPostStrategy', () => {
  let strategy: RegularPostStrategy;

  beforeEach(() => {
    strategy = new RegularPostStrategy();
  });

  describe('canCreatePost', () => {
    it('should return true for regular users', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'user' } as any,
      });

      // Act
      const result = strategy.canCreatePost(user);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for admin users', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'admin' } as any,
      });

      // Act
      const result = strategy.canCreatePost(user);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for moderator users', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'moderator' } as any,
      });

      // Act
      const result = strategy.canCreatePost(user);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canViewPost', () => {
    it('should return true for all posts', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const post = PostMockProvider.createMockPost();

      // Act
      const result = strategy.canViewPost(user, post);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canUpdatePost', () => {
    it('should return true when user is the author', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({ uuid: 'user-uuid-123' });
      const post = PostMockProvider.createMockPost({
        authorUuid: 'user-uuid-123',
      });

      // Act
      const result = strategy.canUpdatePost(user, post);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user is not the author', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({ uuid: 'user-uuid-123' });
      const post = PostMockProvider.createMockPost({
        authorUuid: 'different-user-uuid',
      });

      // Act
      const result = strategy.canUpdatePost(user, post);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canDeletePost', () => {
    it('should return false for regular users', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'user' } as any,
      });
      const post = PostMockProvider.createMockPost();

      // Act
      const result = strategy.canDeletePost(user, post);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false even if user is the author', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        uuid: 'user-uuid-123',
        role: { name: 'user' } as any,
      });
      const post = PostMockProvider.createMockPost({
        authorUuid: 'user-uuid-123',
      });

      // Act
      const result = strategy.canDeletePost(user, post);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateCreateData', () => {
    it('should return true for valid create data', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const createDto = PostMockProvider.createMockCreatePostDto();

      // Act
      const result = strategy.validateCreateData(user, createDto);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for empty content', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const createDto = PostMockProvider.createMockCreatePostDto({
        content: '',
      });

      // Act
      const result = strategy.validateCreateData(user, createDto);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateUpdateData', () => {
    it('should return true for valid update data', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const post = PostMockProvider.createMockPost();
      const updateDto = PostMockProvider.createMockUpdatePostDto();

      // Act
      const result = strategy.validateUpdateData(user, post, updateDto);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for partial update data', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const post = PostMockProvider.createMockPost();
      const updateDto = PostMockProvider.createMockUpdatePostDto({
        content: 'Updated content',
      });

      // Act
      const result = strategy.validateUpdateData(user, post, updateDto);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for empty update data', () => {
      // Arrange
      const user = PostMockProvider.createMockUser();
      const post = PostMockProvider.createMockPost();
      const updateDto = {} as UpdatePostDto;

      // Act
      const result = strategy.validateUpdateData(user, post, updateDto);

      // Assert
      expect(result).toBe(true);
    });
  });
});
