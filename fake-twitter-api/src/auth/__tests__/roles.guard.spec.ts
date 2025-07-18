/**
 * RolesGuard Unit Tests
 *
 * This file contains unit tests for the RolesGuard class.
 * It tests role-based access control functionality.
 *
 * Test Coverage:
 * - canActivate - Allows access when no roles required
 * - canActivate - Allows access when user has required role
 * - canActivate - Denies access when user lacks required role
 * - canActivate - Throws ForbiddenException when user not authenticated
 * - canActivate - Throws ForbiddenException when user has no role
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from '../guards/roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TestDataFactory } from '../../common/__tests__/test-utils';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      // Arrange
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            user: TestDataFactory.createUser(),
          }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(undefined);

      // Act
      const result = guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should allow access when user has required role', () => {
      // Arrange
      const requiredRoles = ['admin', 'moderator'];
      const adminRole = TestDataFactory.createRole({ name: 'admin' });
      const user = TestDataFactory.createUser({ role: adminRole });

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);

      // Act
      const result = guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should deny access when user lacks required role', () => {
      // Arrange
      const requiredRoles = ['admin'];
      const userRole = TestDataFactory.createRole({ name: 'user' });
      const user = TestDataFactory.createUser({ role: userRole });

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);

      // Act & Assert
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'Access denied. Required roles: admin. Your role: user',
      );
    });

    it('should throw ForbiddenException when user not authenticated', () => {
      // Arrange
      const requiredRoles = ['admin'];

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: null }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);

      // Act & Assert
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User authentication required to access this resource',
      );
    });

    it('should throw ForbiddenException when user has no role', () => {
      // Arrange
      const requiredRoles = ['admin'];
      const user = TestDataFactory.createUser({ role: undefined });

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);

      // Act & Assert
      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(mockContext)).toThrow(
        'User authentication required to access this resource',
      );
    });

    it('should allow access when user has one of multiple required roles', () => {
      // Arrange
      const requiredRoles = ['admin', 'moderator'];
      const moderatorRole = TestDataFactory.createRole({ name: 'moderator' });
      const user = TestDataFactory.createUser({ role: moderatorRole });

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user }),
        }),
      } as unknown as ExecutionContext;

      reflector.getAllAndOverride.mockReturnValue(requiredRoles);

      // Act
      const result = guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
    });
  });
});
