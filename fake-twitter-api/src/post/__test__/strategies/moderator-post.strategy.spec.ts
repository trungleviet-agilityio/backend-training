/**
 * Moderator Post Strategy Tests
 *
 * Tests the ModeratorPostStrategy class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorPostStrategy } from '../../strategies/post-moderator.strategy';
import { PostMockProvider } from '../mocks/post-mock.provider';
import { PostTestBuilder } from '../mocks/post-test.builder';

describe('ModeratorPostStrategy', () => {
  let strategy: ModeratorPostStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ModeratorPostStrategy],
    }).compile();

    strategy = moduleRef.get<ModeratorPostStrategy>(ModeratorPostStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canCreatePost', () => {
    it('should allow moderators to create posts', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.canCreatePost(scenario.currentUser!);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow any moderator to create posts', () => {
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
    it('should allow moderators to view any post', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to view unpublished posts', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
      scenario.targetPost!.isPublished = false;

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to view posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
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
    it('should allow moderators to update any post', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.canUpdatePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to update posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
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
    it('should allow moderators to delete any post', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.canDeletePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to delete posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
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
    it('should allow moderators to create any type of post', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to create unpublished posts', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
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
    it('should allow moderators to update any field', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();

      // Act
      const result = strategy.validateUpdateData(
        scenario.currentUser!,
        scenario.targetPost!,
        scenario.updateDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow moderators to update publishing status', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withModeratorUserScenario()
        .build();
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
