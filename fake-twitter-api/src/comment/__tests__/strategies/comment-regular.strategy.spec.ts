/**
 * RegularCommentStrategy Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RegularCommentStrategy } from '../../strategies/comment-regular.strategy';
import { CreateCommentDto, UpdateCommentDto } from '../../dto';
import { CommentMockProvider } from '../mocks/comment-mock.provider';
import { User } from 'src/database/entities/user.entity';

describe('RegularCommentStrategy', () => {
  let strategy: RegularCommentStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RegularCommentStrategy],
    }).compile();

    strategy = moduleRef.get<RegularCommentStrategy>(RegularCommentStrategy);
  });

  describe('canCreateComment', () => {
    it('should allow user to create comment on any post', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const postAuthorId = 'different-user-uuid';

      // Act
      const result = strategy.canCreateComment(currentUser, postAuthorId);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow user to create comment on their own post', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const postAuthorId = currentUser.uuid;

      // Act
      const result = strategy.canCreateComment(currentUser, postAuthorId);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny comment creation for null user', () => {
      // Arrange
      const currentUser = null as unknown as User;
      const postAuthorId = 'user-uuid-123';

      // Act
      const result = strategy.canCreateComment(currentUser, postAuthorId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canUpdateComment', () => {
    it('should allow comment author to update their comment', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: currentUser.uuid,
      });

      // Act
      const result = strategy.canUpdateComment(currentUser, comment);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny non-author from updating comment', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: 'different-user-uuid',
      });

      // Act
      const result = strategy.canUpdateComment(currentUser, comment);

      // Assert
      expect(result).toBe(false);
    });

    it('should deny update for null user', () => {
      // Arrange
      const currentUser = null as unknown as User;
      const comment = CommentMockProvider.createMockComment();

      // Act & Assert
      expect(() => strategy.canUpdateComment(currentUser, comment)).toThrow();
    });
  });

  describe('canDeleteComment', () => {
    it('should allow comment author to delete their comment', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: currentUser.uuid,
      });

      // Act
      const result = strategy.canDeleteComment(currentUser, comment);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny non-author from deleting comment', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: 'different-user-uuid',
      });

      // Act
      const result = strategy.canDeleteComment(currentUser, comment);

      // Assert
      expect(result).toBe(false);
    });

    it('should deny delete for null user', () => {
      // Arrange
      const currentUser = null as unknown as User;
      const comment = CommentMockProvider.createMockComment();

      // Act & Assert
      expect(() => strategy.canDeleteComment(currentUser, comment)).toThrow();
    });
  });

  describe('validateCreateData', () => {
    it('should validate valid create data', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const createData: CreateCommentDto = {
        content: 'Valid comment content',
      };

      // Act
      const result = strategy.validateCreateData(currentUser, createData);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject empty content', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const createData: CreateCommentDto = {
        content: '',
      };

      // Act
      const result = strategy.validateCreateData(currentUser, createData);

      // Assert
      expect(result).toBe(false);
    });

    it('should reject null content', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const createData: CreateCommentDto = {
        content: null as unknown as string,
      };

      // Act
      const result = strategy.validateCreateData(currentUser, createData);

      // Assert
      expect(result).toBe(false);
    });

    it('should reject undefined content', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const createData: CreateCommentDto = {
        content: undefined as unknown as string,
      };

      // Act
      const result = strategy.validateCreateData(currentUser, createData);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateUpdateData', () => {
    it('should validate valid update data for comment author', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: currentUser.uuid,
      });
      const updateData: UpdateCommentDto = {
        content: 'Updated comment content',
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        comment,
        updateData,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should reject update for non-author', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: 'different-user-uuid',
      });
      const updateData: UpdateCommentDto = {
        content: 'Updated comment content',
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        comment,
        updateData,
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should reject update with empty content', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: currentUser.uuid,
      });
      const updateData: UpdateCommentDto = {
        content: '',
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        comment,
        updateData,
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should reject update with null content', () => {
      // Arrange
      const currentUser = CommentMockProvider.createMockUser();
      const comment = CommentMockProvider.createMockComment({
        authorUuid: currentUser.uuid,
      });
      const updateData: UpdateCommentDto = {
        content: null as unknown as string,
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        comment,
        updateData,
      );

      // Assert
      expect(result).toBe(false);
    });
  });
});
