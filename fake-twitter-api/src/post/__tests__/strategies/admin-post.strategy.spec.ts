/**
 * Admin Post Strategy Tests
 *
 * Tests the AdminPostStrategy class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AdminPostStrategy } from '../../strategies/post-admin.strategy';
import { PostMockProvider } from '../mocks/post-mock.provider';
import { PostTestBuilder } from '../mocks/post-test.builder';

describe('AdminPostStrategy', () => {
  let strategy: AdminPostStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [AdminPostStrategy],
    }).compile();

    strategy = moduleRef.get<AdminPostStrategy>(AdminPostStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canCreatePost', () => {
    it('should allow admin to create posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.canCreatePost(scenario.currentUser!);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to create posts regardless of user data', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'admin' } as any,
      });

      // Act
      const result = strategy.canCreatePost(user);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canViewPost', () => {
    it('should allow admin to view any post', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to view unpublished posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.targetPost!.isPublished = false;

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to view posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canUpdatePost', () => {
    it('should allow admin to update any post', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.canUpdatePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to update posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canUpdatePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canDeletePost', () => {
    it('should allow admin to delete any post', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.canDeletePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to delete posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canDeletePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateCreateData', () => {
    it('should allow admin to create any type of post', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to create unpublished posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.createDto!.isPublished = false;

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('validateUpdateData', () => {
    it('should allow admin to update any field', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      // Act
      const result = strategy.validateUpdateData(
        scenario.currentUser!,
        scenario.targetPost!,
        scenario.updateDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow admin to update publishing status', () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();
      scenario.updateDto!.isPublished = false;

      // Act
      const result = strategy.validateUpdateData(
        scenario.currentUser!,
        scenario.targetPost!,
        scenario.updateDto!,
      );

      // Assert
      expect(result).toBe(true);
    });
  });
});
