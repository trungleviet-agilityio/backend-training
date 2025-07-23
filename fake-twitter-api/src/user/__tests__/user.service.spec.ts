/**
 * UserService Unit Tests - Clean & Focused
 * Following AuthService pattern exactly
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { UserOperationFactory } from '../factories/user-operation.factory';
import { UserMapperService } from '../services/user-mapper.service';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { UserTestBuilder } from './mocks/user-test.builder';
import { UserMockProvider } from './mocks/user-mock.provider';
import { Repository, UpdateResult } from 'typeorm';
import { Role } from '../../database/entities/role.entity';

describe('UserService', () => {
  let service: UserService;
  let userOperationFactory: jest.Mocked<UserOperationFactory>;
  let userMapperService: jest.Mocked<UserMapperService>;
  let userRepository: jest.Mocked<Repository<User>>;
  let postRepository: jest.Mocked<Repository<Post>>;
  let commentRepository: jest.Mocked<Repository<Comment>>;

  beforeEach(async () => {
    const mockUserRepository = UserMockProvider.createUserRepository();
    const mockPostRepository = UserMockProvider.createPostRepository();
    const mockCommentRepository = UserMockProvider.createCommentRepository();
    const mockUserOperationFactory =
      UserMockProvider.createUserOperationFactory();
    const mockUserMapperService = UserMockProvider.createUserMapperService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        { provide: UserOperationFactory, useValue: mockUserOperationFactory },
        { provide: UserMapperService, useValue: mockUserMapperService },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
    userOperationFactory = moduleRef.get(UserOperationFactory);
    userMapperService = moduleRef.get(UserMapperService);
    userRepository = moduleRef.get(getRepositoryToken(User));
    postRepository = moduleRef.get(getRepositoryToken(Post));
    commentRepository = moduleRef.get(getRepositoryToken(Comment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find user by UUID successfully', async () => {
      // Arrange - Using Builder Pattern
      const scenario = new UserTestBuilder()
        .withTargetUser(UserMockProvider.createMockUser())
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);

      // Act
      const result = await service.findById(scenario.targetUser!.uuid);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.targetUser!.uuid },
        relations: ['role'],
      });
      expect(result).toEqual(scenario.targetUser);
    });

    it('should handle user not found scenario', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById('non-existent-uuid')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withTargetUser(
          UserMockProvider.createMockUser({ email: 'test@example.com' }),
        )
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);

      // Act
      const result = await service.findByEmail('test@example.com');

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['role'],
      });
      expect(result).toEqual(scenario.targetUser);
    });

    it('should handle user not found by email', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('findByUsername', () => {
    it('should find user by username successfully', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withTargetUser(
          UserMockProvider.createMockUser({ username: 'testuser' }),
        )
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);

      // Act
      const result = await service.findByUsername('testuser');

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        relations: ['role'],
      });
      expect(result).toEqual(scenario.targetUser);
    });

    it('should handle user not found by username', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByUsername('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withTargetUser(UserMockProvider.createMockUser())
        .withUserStats({ postsCount: 5, commentsCount: 10 })
        .withUserProfile({ uuid: 'user-uuid-123', username: 'testuser' })
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      postRepository.count.mockResolvedValue(scenario.userStats!.postsCount);
      commentRepository.count.mockResolvedValue(
        scenario.userStats!.commentsCount,
      );
      userMapperService.toUserProfileDto.mockReturnValue(scenario.userProfile!);

      // Act
      const result = await service.getUserProfile(scenario.targetUser!.uuid);

      // Assert
      expect(userMapperService.toUserProfileDto).toHaveBeenCalledWith(
        scenario.targetUser,
        scenario.userStats,
      );
      expect(result).toEqual(scenario.userProfile);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully with valid permissions', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(UserMockProvider.createMockUser())
        .withTargetUser(UserMockProvider.createMockUser())
        .withUpdateDto({ firstName: 'Updated First' })
        .withUserProfile({ firstName: 'Updated First' })
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canUpdateUser.mockReturnValue(true);
      mockStrategy.validateUpdateData.mockReturnValue(true);

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);
      userRepository.update.mockResolvedValue({
        affected: 1,
      } as unknown as UpdateResult);
      userMapperService.toUserProfileDto.mockReturnValue(scenario.userProfile!);
      postRepository.count.mockResolvedValue(0);
      commentRepository.count.mockResolvedValue(0);

      // Act
      const result = await service.updateUserProfile(
        scenario.currentUser!,
        scenario.targetUser!.uuid,
        scenario.updateDto!,
      );

      // Assert
      expect(mockStrategy.canUpdateUser).toHaveBeenCalledWith(
        scenario.currentUser,
        scenario.targetUser,
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        scenario.targetUser!.uuid,
        scenario.updateDto,
      );
      expect(result).toEqual(scenario.targetUser);
    });

    it('should handle insufficient permissions for update', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(
          UserMockProvider.createMockUser({ uuid: 'different-user-uuid' }),
        )
        .withTargetUser(
          UserMockProvider.createMockUser({ uuid: 'different-user-uuid' }),
        )
        .withUpdateDto({ firstName: 'Updated' })
        .withError(
          new ForbiddenException('You can only update your own profile'),
        )
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canUpdateUser.mockImplementation(() => {
        throw scenario.error;
      });

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        service.updateUserProfile(
          scenario.currentUser!,
          scenario.targetUser!.uuid,
          scenario.updateDto!,
        ),
      ).rejects.toThrow('You can only update your own profile');
    });
  });

  describe('getUserPosts', () => {
    it('should get user posts with pagination successfully', async () => {
      // Arrange
      const posts = [UserMockProvider.createMockPost()];
      const scenario = new UserTestBuilder()
        .withTargetUser(UserMockProvider.createMockUser())
        .withPaginatedPosts(posts, 1, 10, 1)
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      postRepository.findAndCount.mockResolvedValue([posts, 1]);

      // Act
      const result = await service.getUserPosts(
        scenario.targetUser!.uuid,
        1,
        10,
      );

      // Assert
      expect(postRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorUuid: scenario.targetUser!.uuid },
        relations: ['author'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(scenario.paginatedPosts);
    });
  });

  describe('getUserStats', () => {
    it('should get user stats successfully', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withTargetUser(UserMockProvider.createMockUser())
        .withUserStats({ postsCount: 5, commentsCount: 10 })
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      postRepository.count.mockResolvedValue(scenario.userStats!.postsCount);
      commentRepository.count.mockResolvedValue(
        scenario.userStats!.commentsCount,
      );

      // Act
      const result = await service.getUserStats(scenario.targetUser!.uuid);

      // Assert
      expect(postRepository.count).toHaveBeenCalledWith({
        where: { authorUuid: scenario.targetUser!.uuid },
      });
      expect(commentRepository.count).toHaveBeenCalledWith({
        where: { authorUuid: scenario.targetUser!.uuid },
      });
      expect(result).toEqual(scenario.userStats);
    });

    it('should handle user not found when getting stats', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserStats('non-existent-uuid')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('getUserComments', () => {
    it('should get user comments with pagination successfully', async () => {
      // Arrange
      const comments = [UserMockProvider.createMockComment()];
      const scenario = new UserTestBuilder()
        .withTargetUser(UserMockProvider.createMockUser())
        .withPaginatedComments(comments, 1, 10, 1)
        .build();

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      commentRepository.findAndCount.mockResolvedValue([comments, 1]);

      // Act
      const result = await service.getUserComments(
        scenario.targetUser!.uuid,
        1,
        10,
      );

      // Assert
      expect(commentRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorUuid: scenario.targetUser!.uuid },
        relations: ['author', 'post'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(scenario.paginatedComments);
    });

    it('should handle user not found when getting comments', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getUserComments('non-existent-uuid', 1, 10),
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully with admin permissions', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(
          UserMockProvider.createMockUser({ role: { name: 'admin' } } as any),
        )
        .withTargetUser(UserMockProvider.createMockUser())
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canDeleteUser.mockReturnValue(true);

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);
      userRepository.update.mockResolvedValue({
        affected: 1,
      } as unknown as UpdateResult);

      // Act
      await service.deleteUser(
        scenario.currentUser!,
        scenario.targetUser!.uuid,
      );

      // Assert
      expect(mockStrategy.canDeleteUser).toHaveBeenCalledWith(
        scenario.currentUser,
        scenario.targetUser,
      );
      expect(userRepository.softRemove).toHaveBeenCalledWith(
        scenario.targetUser,
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        scenario.targetUser!.uuid,
        {
          deleted: true,
          isActive: false,
        },
      );
    });

    it('should throw error when user tries to delete themselves', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(UserMockProvider.createMockUser({ uuid: 'same-uuid' }))
        .withTargetUser(UserMockProvider.createMockUser({ uuid: 'same-uuid' }))
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canDeleteUser.mockReturnValue(false);

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        service.deleteUser(scenario.currentUser!, scenario.targetUser!.uuid),
      ).rejects.toThrow('You cannot delete your own account');
    });

    it('should throw error when non-admin tries to delete user', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(
          UserMockProvider.createMockUser({
            role: { name: 'user' },
          } as unknown as Role),
        )
        .withTargetUser(
          UserMockProvider.createMockUser({
            uuid: 'different-uuid',
          } as unknown as User),
        )
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canDeleteUser.mockReturnValue(false);

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        service.deleteUser(scenario.currentUser!, scenario.targetUser!.uuid),
      ).rejects.toThrow('Only administrators can delete users');
    });

    it('should throw generic error for other permission issues', async () => {
      // Arrange
      const scenario = new UserTestBuilder()
        .withCurrentUser(
          UserMockProvider.createMockUser({
            role: { name: 'moderator' },
          } as unknown as User),
        )
        .withTargetUser(
          UserMockProvider.createMockUser({ uuid: 'different-uuid' }),
        )
        .build();

      const mockStrategy = UserMockProvider.createUserStrategy();
      mockStrategy.canDeleteUser.mockReturnValue(false);

      userRepository.findOne.mockResolvedValue(scenario.targetUser!);
      userOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        service.deleteUser(scenario.currentUser!, scenario.targetUser!.uuid),
      ).rejects.toThrow('Only administrators can delete users');
    });
  });
});
