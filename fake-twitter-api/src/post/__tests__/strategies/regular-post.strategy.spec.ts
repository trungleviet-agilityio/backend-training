/**
 * Regular Post Strategy Tests
 *
 * Tests the RegularPostStrategy class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RegularPostStrategy } from '../../strategies/post-regular.strategy';
import { PostMockProvider } from '../mocks/post-mock.provider';
import { PostTestBuilder } from '../mocks/post-test.builder';
import { Role } from '../../../database/entities/role.entity';

describe('RegularPostStrategy', () => {
  let strategy: RegularPostStrategy;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [RegularPostStrategy],
    }).compile();

    strategy = moduleRef.get<RegularPostStrategy>(RegularPostStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canCreatePost', () => {
    it('should allow regular users to create posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();

      // Act
      const result = strategy.canCreatePost(scenario.currentUser!);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow any user to create posts', () => {
      // Arrange
      const user = PostMockProvider.createMockUser({
        role: { name: 'user' } as Role,
      });

      // Act
      const result = strategy.canCreatePost(user);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canViewPost', () => {
    it('should allow users to view published posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.isPublished = true;
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow users to view their own posts regardless of publishing status', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.isPublished = false;
      scenario.targetPost!.authorUuid = scenario.currentUser!.uuid;

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow users to view unpublished posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.isPublished = false;
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canViewPost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canUpdatePost', () => {
    it('should allow users to update their own posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.authorUuid = scenario.currentUser!.uuid;

      // Act
      const result = strategy.canUpdatePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow users to update posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canUpdatePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canDeletePost', () => {
    it('should allow users to delete their own posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.authorUuid = scenario.currentUser!.uuid;

      // Act
      const result = strategy.canDeletePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow users to delete posts from other users', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.targetPost!.authorUuid = 'different-user-uuid';

      // Act
      const result = strategy.canDeletePost(
        scenario.currentUser!,
        scenario.targetPost!,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateCreateData', () => {
    it('should allow users to create published posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.createDto!.isPublished = true;

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow users to create posts with default publishing status', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.createDto!.isPublished = undefined;

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should not allow users to create unpublished posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
      scenario.createDto!.isPublished = false;

      // Act
      const result = strategy.validateCreateData(
        scenario.currentUser!,
        scenario.createDto!,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateUpdateData', () => {
    it('should allow users to update any field of their posts', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();

      // Act
      const result = strategy.validateUpdateData(
        scenario.currentUser!,
        scenario.targetPost!,
        scenario.updateDto!,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should allow users to update publishing status', () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();
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
