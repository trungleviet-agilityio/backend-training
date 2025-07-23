/**
 * UserRepository Unit Tests
 *
 * Tests the user repository following Repository Pattern
 * and ensuring proper database operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { Comment } from '../../../database/entities/comment.entity';
import { UserTestBuilder } from '../mocks/user-test.builder';

describe('UserRepository', () => {
  let repository: UserRepository;
  let userRepository: jest.Mocked<Repository<User>>;
  let postRepository: jest.Mocked<Repository<Post>>;
  let commentRepository: jest.Mocked<Repository<Comment>>;
  let userTestBuilder: UserTestBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            count: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            count: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    userRepository = module.get(getRepositoryToken(User));
    postRepository = module.get(getRepositoryToken(Post));
    commentRepository = module.get(getRepositoryToken(Comment));

    userTestBuilder = new UserTestBuilder();
  });

  describe('findById', () => {
    it('should find user by UUID successfully', async () => {
      // Arrange
      const user = userTestBuilder
        .withTargetUser({ uuid: 'test-uuid' })
        .buildTargetUser();
      userRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await repository.findById('test-uuid');

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'test-uuid' },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.findById('non-existent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      // Arrange
      const user = userTestBuilder
        .withTargetUser({ email: 'test@example.com' })
        .buildTargetUser();
      userRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await repository.findByEmail('test@example.com');

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should throw error when user not found by email', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        repository.findByEmail('nonexistent@example.com'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('findByUsername', () => {
    it('should find user by username successfully', async () => {
      // Arrange
      const user = userTestBuilder
        .withTargetUser({ username: 'testuser' })
        .buildTargetUser();
      userRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await repository.findByUsername('testuser');

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        relations: ['role'],
      });
      expect(result).toEqual(user);
    });

    it('should throw error when user not found by username', async () => {
      // Arrange
      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.findByUsername('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const updateData = { firstName: 'John', lastName: 'Doe' };
      const updatedUser = userTestBuilder
        .withTargetUser({
          uuid: 'test-uuid',
          firstName: 'John',
          lastName: 'Doe',
        })
        .buildTargetUser();

      userRepository.update.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      } as unknown as UpdateResult);
      userRepository.findOne.mockResolvedValue(updatedUser);

      // Act
      const result = await repository.update('test-uuid', updateData);

      // Assert
      expect(userRepository.update).toHaveBeenCalledWith(
        'test-uuid',
        updateData,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'test-uuid' },
        relations: ['role'],
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('getUserStats', () => {
    it('should return user stats successfully', async () => {
      // Arrange
      const postsCount = 5;
      const commentsCount = 10;

      postRepository.count.mockResolvedValue(postsCount);
      commentRepository.count.mockResolvedValue(commentsCount);

      // Act
      const result = await repository.getUserStats('test-uuid');

      // Assert
      expect(postRepository.count).toHaveBeenCalledWith({
        where: { authorUuid: 'test-uuid' },
      });
      expect(commentRepository.count).toHaveBeenCalledWith({
        where: { authorUuid: 'test-uuid' },
      });
      expect(result).toEqual({
        postsCount,
        commentsCount,
        followersCount: 0,
        followingCount: 0,
      });
    });
  });

  describe('getUserPosts', () => {
    it('should return paginated user posts successfully', async () => {
      // Arrange
      const posts = [
        { uuid: 'post-1', content: 'Post 1' } as Post,
        { uuid: 'post-2', content: 'Post 2' } as Post,
      ];
      const total = 2;
      const page = 1;
      const limit = 10;

      postRepository.findAndCount.mockResolvedValue([posts, total]);

      // Act
      const result = await repository.getUserPosts('test-uuid', page, limit);

      // Assert
      expect(postRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorUuid: 'test-uuid' },
        relations: ['author'],
        skip: 0,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: posts,
        meta: {
          page,
          limit,
          total,
          totalPages: 1,
        },
      });
    });

    it('should calculate total pages correctly', async () => {
      // Arrange
      const posts = [{ uuid: 'post-1', content: 'Post 1' } as Post];
      const total = 25;
      const page = 1;
      const limit = 10;

      postRepository.findAndCount.mockResolvedValue([posts, total]);

      // Act
      const result = await repository.getUserPosts('test-uuid', page, limit);

      // Assert
      expect(result.meta.totalPages).toBe(3); // Math.ceil(25 / 10) = 3
    });
  });

  describe('getUserComments', () => {
    it('should return paginated user comments successfully', async () => {
      // Arrange
      const comments = [
        { uuid: 'comment-1', content: 'Comment 1' } as Comment,
        { uuid: 'comment-2', content: 'Comment 2' } as Comment,
      ];
      const total = 2;
      const page = 1;
      const limit = 10;

      commentRepository.findAndCount.mockResolvedValue([comments, total]);

      // Act
      const result = await repository.getUserComments('test-uuid', page, limit);

      // Assert
      expect(commentRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorUuid: 'test-uuid' },
        relations: ['author', 'post'],
        skip: 0,
        take: limit,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        data: comments,
        meta: {
          page,
          limit,
          total,
          totalPages: 1,
        },
      });
    });
  });
});
