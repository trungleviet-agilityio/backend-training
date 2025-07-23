/**
 * Post Operation Factory Tests
 *
 * Tests the PostOperationFactory class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PostOperationFactory } from '../factories/post-operation.factory';
import { AdminPostStrategy } from '../strategies/post-admin.strategy';
import { RegularPostStrategy } from '../strategies/post-regular.strategy';
import { ModeratorPostStrategy } from '../strategies/post-moderator.strategy';

describe('PostOperationFactory', () => {
  let factory: PostOperationFactory;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PostOperationFactory,
        AdminPostStrategy,
        RegularPostStrategy,
        ModeratorPostStrategy,
      ],
    }).compile();

    factory = moduleRef.get<PostOperationFactory>(PostOperationFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStrategy', () => {
    it('should create admin strategy for admin role', () => {
      // Arrange
      const roleName = 'admin';

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(AdminPostStrategy);
    });

    it('should create regular strategy for user role', () => {
      // Arrange
      const roleName = 'user';

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(RegularPostStrategy);
    });

    it('should create moderator strategy for moderator role', () => {
      // Arrange
      const roleName = 'moderator';

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(ModeratorPostStrategy);
    });

    it('should create regular strategy for unknown role', () => {
      // Arrange
      const roleName = 'unknown';

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(RegularPostStrategy);
    });

    it('should create regular strategy for empty role', () => {
      // Arrange
      const roleName = '';

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(RegularPostStrategy);
    });

    it('should create regular strategy for undefined role', () => {
      // Arrange
      const roleName = undefined as unknown as string;

      // Act
      const result = factory.createStrategy(roleName);

      // Assert
      expect(result).toBeInstanceOf(RegularPostStrategy);
    });
  });

  describe('Strategy Behavior', () => {
    it('should return different strategy instances for different roles', () => {
      // Arrange
      const adminRole = 'admin';
      const userRole = 'user';
      const moderatorRole = 'moderator';

      // Act
      const adminStrategy = factory.createStrategy(adminRole);
      const userStrategy = factory.createStrategy(userRole);
      const moderatorStrategy = factory.createStrategy(moderatorRole);

      // Assert
      expect(adminStrategy).not.toBe(userStrategy);
      expect(adminStrategy).not.toBe(moderatorStrategy);
      expect(userStrategy).not.toBe(moderatorStrategy);
    });

    it('should return same strategy instance for same role', () => {
      // Arrange
      const roleName = 'admin';

      // Act
      const strategy1 = factory.createStrategy(roleName);
      const strategy2 = factory.createStrategy(roleName);

      // Assert
      expect(strategy1).toBe(strategy2);
    });
  });
});
