/**
 * AdminUserStrategy Unit Tests
 *
 * Tests the admin user operation strategy following
 * the Strategy Pattern and Single Responsibility Principle
 */

import { UserUpdatePayloadDto } from '../../dto/update-user.dto';
import { UserTestBuilder } from '../mocks/user-test.builder';
import { AdminUserStrategy } from '../../strategies/user-admin.strategy';
import { Role } from '../../../database/entities/role.entity';

describe('AdminUserStrategy', () => {
  let strategy: AdminUserStrategy;
  let userTestBuilder: UserTestBuilder;

  beforeEach(() => {
    strategy = new AdminUserStrategy();
    userTestBuilder = new UserTestBuilder();
  });

  describe('canUpdateUser', () => {
    it('should return true when current user is admin', () => {
      // Arrange
      const adminUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid', role: { name: 'admin' } as Role })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(adminUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when current user is updating their own profile', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid', role: { name: 'user' } as Role })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canUpdateUser(currentUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when regular user tries to update another user', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid', role: { name: 'user' } as Role })
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
    it('should always return true for admin strategy', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid', role: { name: 'admin' } as Role })
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
    it('should return true when admin deletes another user', () => {
      // Arrange
      const adminUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid', role: { name: 'admin' } as Role })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'target-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canDeleteUser(adminUser, targetUser);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when admin tries to delete themselves', () => {
      // Arrange
      const adminUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid', role: { name: 'admin' } as Role })
        .buildTargetUser();

      const targetUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid' })
        .buildTargetUser();

      // Act
      const result = strategy.canDeleteUser(adminUser, targetUser);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when regular user tries to delete any user', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'user-uuid', role: { name: 'user' } as Role })
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
    it('should always return true for admin strategy', () => {
      // Arrange
      const currentUser = userTestBuilder
        .withTargetUser({ uuid: 'admin-uuid', role: { name: 'admin' } as Role })
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
  });
});
