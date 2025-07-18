/**
 * Post Operation Factory Tests
 *
 * Tests the PostOperationFactory class
 */

import { PostOperationFactory } from '../factories/post-operation.factory';
import { AdminPostStrategy } from '../strategies/post-admin.strategy';
import { ModeratorPostStrategy } from '../strategies/post-moderator.strategy';
import { RegularPostStrategy } from '../strategies/post-regular.strategy';

describe('PostOperationFactory', () => {
  let factory: PostOperationFactory;
  let adminStrategy: AdminPostStrategy;
  let moderatorStrategy: ModeratorPostStrategy;
  let regularStrategy: RegularPostStrategy;

  beforeEach(() => {
    adminStrategy = new AdminPostStrategy();
    moderatorStrategy = new ModeratorPostStrategy();
    regularStrategy = new RegularPostStrategy();
    factory = new PostOperationFactory(
      adminStrategy,
      moderatorStrategy,
      regularStrategy,
    );
  });

  describe('createStrategy', () => {
    it('should return AdminPostStrategy for admin role', () => {
      // Act
      const strategy = factory.createStrategy('admin');

      // Assert
      expect(strategy).toBeInstanceOf(AdminPostStrategy);
    });

    it('should return ModeratorPostStrategy for moderator role', () => {
      // Act
      const strategy = factory.createStrategy('moderator');

      // Assert
      expect(strategy).toBeInstanceOf(ModeratorPostStrategy);
    });

    it('should return RegularPostStrategy for user role', () => {
      // Act
      const strategy = factory.createStrategy('user');

      // Assert
      expect(strategy).toBeInstanceOf(RegularPostStrategy);
    });

    it('should return RegularPostStrategy for unknown role', () => {
      // Act
      const strategy = factory.createStrategy('unknown');

      // Assert
      expect(strategy).toBeInstanceOf(RegularPostStrategy);
    });

    it('should return RegularPostStrategy for empty string role', () => {
      // Act
      const strategy = factory.createStrategy('');

      // Assert
      expect(strategy).toBeInstanceOf(RegularPostStrategy);
    });

    it('should return RegularPostStrategy for null role', () => {
      // Act
      const strategy = factory.createStrategy(null as any);

      // Assert
      expect(strategy).toBeInstanceOf(RegularPostStrategy);
    });

    it('should return RegularPostStrategy for undefined role', () => {
      // Act
      const strategy = factory.createStrategy(undefined as any);

      // Assert
      expect(strategy).toBeInstanceOf(RegularPostStrategy);
    });

    it('should handle case-sensitive role names', () => {
      // Act
      const adminStrategy = factory.createStrategy('ADMIN');
      const moderatorStrategy = factory.createStrategy('MODERATOR');
      const userStrategy = factory.createStrategy('USER');

      // Assert
      expect(adminStrategy).toBeInstanceOf(RegularPostStrategy);
      expect(moderatorStrategy).toBeInstanceOf(RegularPostStrategy);
      expect(userStrategy).toBeInstanceOf(RegularPostStrategy);
    });
  });
});
