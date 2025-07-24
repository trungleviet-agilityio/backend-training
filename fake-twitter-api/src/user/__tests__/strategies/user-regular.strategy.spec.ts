/**
 * RegularUserStrategy Unit Tests
 *
 * Tests the regular user operation strategy following
 * the Strategy Pattern and Single Responsibility Principle
 */

import { RegularUserStrategy } from '../../strategies/user-regular.strategy';
import { UserUpdatePayloadDto } from '../../dto/update-user.dto';
import { UserTestBuilder } from '../mocks/user-test.builder';

describe('RegularUserStrategy', () => {
  let strategy: RegularUserStrategy;
  let userTestBuilder: UserTestBuilder;

  beforeEach(() => {
    strategy = new RegularUserStrategy();
    userTestBuilder = new UserTestBuilder();
  });

  describe('canUpdateUser', () => {
    it('should return true when user updates their own profile', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when user tries to update another user profile', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canViewUser', () => {
    it('should always return true for regular users', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canViewUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canDeleteUser', () => {
    it('should always return false for regular users', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canDeleteUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateUpdateData', () => {
    it('should return true for allowed fields', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/avatar.jpg',
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        targetUser,
        updateData,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when trying to update restricted fields', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Updated bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        email: 'newemail@example.com', // Restricted field
      } as UserUpdatePayloadDto;

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        targetUser,
        updateData,
      );

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for partial allowed fields', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'John',
        bio: 'Updated bio',
      };

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        targetUser,
        updateData,
      );

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for empty update data', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {};

      // Act
      const result = strategy.validateUpdateData(
        currentUser,
        targetUser,
        updateData,
      );

      // Assert
      expect(result).toBe(true); // Empty object should be valid
    });
  });
});
