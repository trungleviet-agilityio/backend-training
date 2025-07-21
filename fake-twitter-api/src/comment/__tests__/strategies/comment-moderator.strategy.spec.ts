/**
 * ModeratorCommentStrategy Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorCommentStrategy } from '../../strategies/comment-moderator.strategy';

describe('ModeratorCommentStrategy', () => {
  let strategy: ModeratorCommentStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ModeratorCommentStrategy],
    }).compile();

    strategy = moduleRef.get<ModeratorCommentStrategy>(ModeratorCommentStrategy);
  });

  describe('canCreateComment', () => {
    it('should always allow moderator to create comment', () => {
      // Act
      const result = strategy.canCreateComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canUpdateComment', () => {
    it('should always allow moderator to update any comment', () => {
      // Act
      const result = strategy.canUpdateComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canDeleteComment', () => {
    it('should always allow moderator to delete any comment', () => {
      // Act
      const result = strategy.canDeleteComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateCreateData', () => {
    it('should always validate create data for moderator', () => {
      // Act
      const result = strategy.validateCreateData();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateUpdateData', () => {
    it('should always validate update data for moderator', () => {
      // Act
      const result = strategy.validateUpdateData();

      // Assert
      expect(result).toBe(true);
    });
  });
}); 