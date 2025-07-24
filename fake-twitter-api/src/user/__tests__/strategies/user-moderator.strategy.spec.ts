/**
 * ModeratorUserStrategy Unit Tests
 *
 * Tests the moderator user operation strategy following
 * the Strategy Pattern and Single Responsibility Principle
 */

import { ModeratorUserStrategy } from '../../strategies/user-moderator.strategy';
import { UserUpdatePayloadDto } from '../../dto/update-user.dto';
import { UserTestBuilder } from '../mocks/user-test.builder';
import { Role } from '../../../database/entities/role.entity';

describe('ModeratorUserStrategy', () => {
  let strategy: ModeratorUserStrategy;
  let userTestBuilder: UserTestBuilder;

  beforeEach(() => {
    strategy = new ModeratorUserStrategy();
    userTestBuilder = new UserTestBuilder();
  });

  describe('canUpdateUser', () => {
    it('should return true when moderator updates their own profile', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({
          uuid: 'mod-uuid',
          role: { name: 'moderator' } as Role,
        })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when moderator tries to update another user', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({
          uuid: 'mod-uuid',
          role: { name: 'moderator' } as Role,
        })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'other-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('canViewUser', () => {
    it('should always return true for moderators', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({
          uuid: 'mod-uuid',
          role: { name: 'moderator' } as Role,
        })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'other-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canViewUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('canDeleteUser', () => {
    it('should always return false for moderators', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({
          uuid: 'mod-uuid',
          role: { name: 'moderator' } as Role,
        })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'other-uuid' })
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
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'Jane',
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
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'Jane',
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
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();

      const updateData: UserUpdatePayloadDto = {
        firstName: 'Jane',
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
        .withTargetUser({ uuid: 'mod-uuid' })
        .buildTargetUser();
      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'mod-uuid' })
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
