/**
 * UserController Unit Tests - Clean & Focused
 * Following AuthController pattern exactly
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserController } from '../user.controller';
import { UserService } from '../services/user.service';
import { PostMapperService } from '../../post/services/post-mapper.service';
import { UserTestBuilder } from './mocks/user-test.builder';
import { UserMockProvider } from './mocks/user-mock.provider';
import { PostDto } from '../../post/dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;
  let postMapperService: jest.Mocked<PostMapperService>;

  beforeEach(async () => {
    const mockUserService = UserMockProvider.createUserService();
    const mockPostMapperService = {
      toPostDtoList: jest.fn(),
    } as unknown as jest.Mocked<PostMapperService>;

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PostMapperService, useValue: mockPostMapperService },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get(UserService);
    postMapperService = moduleRef.get(PostMapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange - Using Builder Pattern
      const scenario = new UserTestBuilder()
        .withUserProfile({ uuid: 'user-uuid-123', username: 'testuser' })
        .build();

      userService.getUserProfile.mockResolvedValue(scenario.userProfile!);

      // Act
      const result = await controller.getUserProfile('user-uuid-123');

      // Assert
      expect(userService.getUserProfile).toHaveBeenCalledWith('user-uuid-123');
      expect(result).toEqual({ user: scenario.userProfile });
    });

    it('should handle user not found', async () => {
      // Arrange
      userService.getUserProfile.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.getUserProfile('non-existent-uuid'),
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

      userService.updateUserProfile.mockResolvedValue(scenario.targetUser!);

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
      expect(result).toEqual({ user: scenario.targetUser });
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
      const mockPostDto = {
        uuid: 'post-uuid',
        content: 'Test post',
      } as PostDto;
      const mockPostDtoList = [mockPostDto];
      userService.getUserPosts.mockResolvedValue(scenario.paginatedPosts!);
      postMapperService.toPostDtoList.mockReturnValue(
        mockPostDtoList as unknown as PostDto[],
      );

      // Act
      const result = await controller.getUserPosts('user-uuid-123', 1, 10);
      // Assert
      expect(userService.getUserPosts).toHaveBeenCalledWith(
        'user-uuid-123',
        1,
        10,
      );
      expect(result.data).toEqual(mockPostDtoList);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully with admin permissions', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withJwtPayload({ sub: 'admin-uuid-123', role: 'admin' })
        .build();

      userService.deleteUser.mockResolvedValue(undefined);

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
