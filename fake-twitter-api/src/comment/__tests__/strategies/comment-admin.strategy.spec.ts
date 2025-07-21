/**
 * AdminCommentStrategy Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AdminCommentStrategy } from '../../strategies/comment-admin.strategy';

describe('AdminCommentStrategy', () => {
  let strategy: AdminCommentStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AdminCommentStrategy],
    }).compile();

    strategy = moduleRef.get<AdminCommentStrategy>(AdminCommentStrategy);
  });

  describe('canCreateComment', () => {
    it('should always allow admin to create comment', () => {
      // Act
      const result = strategy.canCreateComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canUpdateComment', () => {
    it('should always allow admin to update any comment', () => {
      // Act
      const result = strategy.canUpdateComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canDeleteComment', () => {
    it('should always allow admin to delete any comment', () => {
      // Act
      const result = strategy.canDeleteComment();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateCreateData', () => {
    it('should always validate create data for admin', () => {
      // Act
      const result = strategy.validateCreateData();

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateUpdateData', () => {
    it('should always validate update data for admin', () => {
      // Act
      const result = strategy.validateUpdateData();

      // Assert
      expect(result).toBe(true);
    });
  });
});
