/**
 * UserOperationFactory Unit Tests
 * Comprehensive testing following NestJS best practices and design patterns
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserOperationFactory } from '../factories/user-operation.factory';
import {
  AdminUserStrategy,
  ModeratorUserStrategy,
  RegularUserStrategy,
} from '../strategies';

describe('UserOperationFactory', () => {
  let factory: UserOperationFactory;
  let adminStrategy: jest.Mocked<AdminUserStrategy>;
  let moderatorStrategy: jest.Mocked<ModeratorUserStrategy>;
  let regularStrategy: jest.Mocked<RegularUserStrategy>;

  beforeEach(async () => {
    const mockAdminStrategy = {
      canUpdateUser: jest.fn(),
      canDeleteUser: jest.fn(),
      canViewUser: jest.fn(),
      validateUpdateData: jest.fn(),
    };

    const mockModeratorStrategy = {
      canUpdateUser: jest.fn(),
      canDeleteUser: jest.fn(),
      canViewUser: jest.fn(),
      validateUpdateData: jest.fn(),
    };

    const mockRegularStrategy = {
      canUpdateUser: jest.fn(),
      canDeleteUser: jest.fn(),
      canViewUser: jest.fn(),
      validateUpdateData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserOperationFactory,
        {
          provide: AdminUserStrategy,
          useValue: mockAdminStrategy,
        },
        {
          provide: ModeratorUserStrategy,
          useValue: mockModeratorStrategy,
        },
        {
          provide: RegularUserStrategy,
          useValue: mockRegularStrategy,
        },
      ],
    }).compile();

    factory = module.get<UserOperationFactory>(UserOperationFactory);
    adminStrategy = module.get(AdminUserStrategy);
    moderatorStrategy = module.get(ModeratorUserStrategy);
    regularStrategy = module.get(RegularUserStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createStrategy', () => {
    it('should return AdminUserStrategy for admin role', () => {
      // Act
      const strategy = factory.createStrategy('admin');

      // Assert
      expect(strategy).toBe(adminStrategy);
    });

    it('should return ModeratorUserStrategy for moderator role', () => {
      // Act
      const strategy = factory.createStrategy('moderator');

      // Assert
      expect(strategy).toBe(moderatorStrategy);
    });

    it('should return RegularUserStrategy for user role', () => {
      // Act
      const strategy = factory.createStrategy('user');

      // Assert
      expect(strategy).toBe(regularStrategy);
    });

    it('should return RegularUserStrategy for unknown role', () => {
      // Act
      const strategy = factory.createStrategy('unknown');

      // Assert
      expect(strategy).toBe(regularStrategy);
    });

    it('should return RegularUserStrategy for empty string role', () => {
      // Act
      const strategy = factory.createStrategy('');

      // Assert
      expect(strategy).toBe(regularStrategy);
    });

    it('should return RegularUserStrategy for null role', () => {
      // Act
      const strategy = factory.createStrategy(null as any);

      // Assert
      expect(strategy).toBe(regularStrategy);
    });

    it('should return RegularUserStrategy for undefined role', () => {
      // Act
      const strategy = factory.createStrategy(undefined as any);

      // Assert
      expect(strategy).toBe(regularStrategy);
    });

    it('should handle case-sensitive role names', () => {
      // Act & Assert
      expect(factory.createStrategy('Admin')).toBe(regularStrategy);
      expect(factory.createStrategy('ADMIN')).toBe(regularStrategy);
      expect(factory.createStrategy('Moderator')).toBe(regularStrategy);
      expect(factory.createStrategy('MODERATOR')).toBe(regularStrategy);
    });
  });
});
