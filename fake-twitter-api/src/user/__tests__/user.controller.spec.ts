/**
 * UserController Unit Tests - Clean & Focused
 * Following AuthController pattern exactly
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserController } from '../user.controller';
import { UserService } from '../services/user.service';
import { UserTestBuilder } from './mocks/user-test.builder';
import { UserMockProvider } from './mocks/user-mock.provider';
import {
  UserProfileResponseDto,
  UserPostsResponseDto,
} from '../dto/user-response.dto';
import { UserProfileDto } from '../dto/user.dto';
import { PaginationMeta } from '../../common/dto/api-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = UserMockProvider.createUserService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange - Using Builder Pattern
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'admin' })
        .withUserProfile({ uuid: 'user-uuid-123', username: 'testuser' })
        .build();

      const expectedResponse = new UserProfileResponseDto(
        new UserProfileDto(UserMockProvider.createMockUser()),
      );
      userService.getUserProfile.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getUserProfile(
        scenario.jwtPayload!,
        'user-uuid-123',
      );

      // Assert
      expect(userService.getUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'user-uuid-123',
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle user not found', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' })
        .build();

      userService.getUserProfile.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.getUserProfile(scenario.jwtPayload!, 'non-existent-uuid'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' })
        .withUpdateDto({ firstName: 'Updated First' })
        .withUserProfile({ firstName: 'Updated First' })
        .build();

      const expectedResponse = new UserProfileResponseDto(
        new UserProfileDto(UserMockProvider.createMockUser()),
      );
      userService.updateUserProfile.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.updateUserProfile(
        scenario.jwtPayload!,
        'user-uuid-123',
        scenario.updateDto!,
      );

      // Assert
      expect(userService.updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'user-uuid-123',
        scenario.updateDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle forbidden update attempts', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' })
        .withUpdateDto({ firstName: 'Updated' })
        .withError(
          new ForbiddenException('You can only update your own profile'),
        )
        .build();

      userService.updateUserProfile.mockRejectedValue(scenario.error);

      // Act & Assert
      await expect(
        controller.updateUserProfile(
          scenario.jwtPayload!,
          'different-user-uuid',
          scenario.updateDto!,
        ),
      ).rejects.toThrow('You can only update your own profile');
    });
  });

  describe('getUserPosts', () => {
    it('should get user posts with pagination', async () => {
      // Arrange
      const posts = [UserMockProvider.createMockPost()];
      const scenario = new UserTestBuilder()
        .withPaginatedPosts(posts, 1, 10, 1)
        .build();

      const expectedResponse = new UserPostsResponseDto(
        scenario.userPosts!.items,
        new PaginationMeta(1, 10, 1),
      );
      userService.getUserPosts.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getUserPosts('user-uuid-123', 1, 10);
      // Assert
      expect(userService.getUserPosts).toHaveBeenCalledWith(
        'user-uuid-123',
        1,
        10,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully with admin permissions', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'admin-uuid-123', role: 'admin' })
        .build();

      userService.deleteUser.mockResolvedValue(scenario.targetUser!);

      // Act
      await controller.deleteUser(scenario.jwtPayload!, 'user-uuid-123');

      // Assert
      expect(userService.deleteUser).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'user-uuid-123',
      );
    });
  });
});
