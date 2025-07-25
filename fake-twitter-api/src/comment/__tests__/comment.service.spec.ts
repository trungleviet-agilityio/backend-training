/**
 * CommentService Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CommentService } from '../services/comment.service';
import { CommentMapperService } from '../services/comment-mapper.service';
import { CommentOperationFactory } from '../factories/comment-operation.factory';
import { Comment } from '../../database/entities/comment.entity';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { CommentTestBuilder } from './mocks/comment-test.builder';
import { CommentMockProvider } from './mocks/comment-mock.provider';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

describe('CommentService', () => {
  let service: CommentService;
  let commentOperationFactory: jest.Mocked<CommentOperationFactory>;
  let commentMapperService: jest.Mocked<CommentMapperService>;
  let commentRepository: jest.Mocked<Repository<Comment>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let postRepository: jest.Mocked<Repository<Post>>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: CommentMockProvider.createCommentRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: CommentMockProvider.createUserRepository(),
        },
        {
          provide: getRepositoryToken(Post),
          useValue: CommentMockProvider.createPostRepository(),
        },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn(),
          } as unknown as jest.Mocked<DataSource>,
        },
        {
          provide: CommentOperationFactory,
          useValue: CommentMockProvider.createCommentOperationFactory(),
        },
        {
          provide: CommentMapperService,
          useValue: CommentMockProvider.createCommentMapperService(),
        },
      ],
    }).compile();

    service = moduleRef.get<CommentService>(CommentService);
    commentOperationFactory = moduleRef.get(CommentOperationFactory);
    commentMapperService = moduleRef.get(CommentMapperService);
    commentRepository = moduleRef.get(getRepositoryToken(Comment));
    userRepository = moduleRef.get(getRepositoryToken(User));
    postRepository = moduleRef.get(getRepositoryToken(Post));
    dataSource = moduleRef.get(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find comment by UUID successfully', async () => {
      // Arrange - Using Builder Pattern
      const scenario = new CommentTestBuilder()
        .withTargetComment(CommentMockProvider.createMockComment())
        .build();

      commentRepository.findOne.mockResolvedValue(scenario.targetComment);

      // Act
      const result = await service.findById(scenario.targetComment!.uuid);

      // Assert
      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.targetComment!.uuid },
        relations: ['author', 'post', 'replies'],
      });
      expect(result).toEqual(scenario.targetComment);
    });

    it('should handle comment not found scenario', async () => {
      // Arrange
      commentRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findById('non-existent-uuid')).rejects.toThrow(
        'Comment not found',
      );
    });

    it('should find comment with permission check successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withTargetComment(CommentMockProvider.createMockComment())
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .build();

      commentRepository.findOne.mockResolvedValue(scenario.targetComment);
      userRepository.findOne.mockResolvedValue(scenario.targetUser);
      commentOperationFactory.createStrategy.mockReturnValue(
        CommentMockProvider.createCommentStrategy(),
      );

      // Act
      const result = await service.findById(
        scenario.targetComment!.uuid,
        scenario.currentUser!,
      );

      // Assert
      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.targetComment!.uuid },
        relations: ['author', 'post', 'replies'],
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.currentUser!.uuid },
        relations: ['role'],
      });
      expect(result).toEqual(scenario.targetComment);
    });
  });

  describe('getPostComments', () => {
    it('should get post comments successfully', async () => {
      // Arrange
      const mockComments = [CommentMockProvider.createMockComment()];
      const mockPost = CommentMockProvider.createMockPost();

      postRepository.findOne.mockResolvedValue(mockPost);
      commentRepository.findAndCount.mockResolvedValue([mockComments, 1]);

      // Act
      const result = await service.getPostComments('post-uuid-123', 1, 20);

      // Assert
      expect(commentRepository.findAndCount).toHaveBeenCalledWith({
        where: { postUuid: 'post-uuid-123', parentUuid: undefined },
        relations: ['author', 'replies'],
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 20,
      });
      expect(result).toEqual({
        data: mockComments,
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should handle empty results', async () => {
      // Arrange
      commentRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.getPostComments('post-uuid-123', 1, 20);

      // Assert
      expect(result).toEqual({
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
    });
  });

  describe('getCommentReplies', () => {
    it('should get comment replies successfully', async () => {
      // Arrange
      const mockReplies = [CommentMockProvider.createMockComment()];
      const mockComment = CommentMockProvider.createMockComment();

      commentRepository.findOne.mockResolvedValue(mockComment);
      commentRepository.findAndCount.mockResolvedValue([mockReplies, 1]);

      // Act
      const result = await service.getCommentReplies('comment-uuid-123', 1, 20);

      // Assert
      expect(commentRepository.findAndCount).toHaveBeenCalledWith({
        where: { parentUuid: 'comment-uuid-123' },
        relations: ['author', 'replies'],
        order: { createdAt: 'ASC' },
        skip: 0,
        take: 20,
      });
      expect(result).toEqual({
        data: mockReplies,
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should handle empty replies', async () => {
      // Arrange
      commentRepository.findAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.getCommentReplies('comment-uuid-123', 1, 20);

      // Assert
      expect(result).toEqual({
        data: [],
        meta: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      });
    });
  });

  describe('createComment', () => {
    it('should create comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .withTargetPost(CommentMockProvider.createMockPost())
        .withTargetComment(CommentMockProvider.createMockComment())
        .build();

      const mockStrategy = CommentMockProvider.createCommentStrategy();
      mockStrategy.canCreateComment.mockReturnValue(true);
      mockStrategy.validateCreateData.mockReturnValue(true);
      commentOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Mock transaction with unified signature
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };

          // Mock the sequence of calls in the transaction
          mockManager.findOne
            .mockResolvedValueOnce(scenario.targetUser) // User found
            .mockResolvedValueOnce(scenario.targetPost) // Post found
            .mockResolvedValueOnce(scenario.targetComment); // Comment with relations

          mockManager.create.mockReturnValue(scenario.targetComment);
          mockManager.save.mockResolvedValue(scenario.targetComment);

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act
      const result = await service.createComment(
        scenario.currentUser!,
        'post-uuid-123',
        { content: 'New comment content' },
      );

      // Assert
      expect(dataSource.transaction).toHaveBeenCalled();
      expect(result).toEqual(scenario.targetComment);
    });

    it('should handle user not found', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .build();

      // Mock transaction to return null for user
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };

          mockManager.findOne.mockResolvedValue(null); // User not found

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act & Assert
      await expect(
        service.createComment(scenario.currentUser!, 'post-uuid-123', {
          content: 'New comment content',
        }),
      ).rejects.toThrow('User not found');
    });

    it('should handle post not found', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .build();

      // Mock transaction to return null for post
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };

          mockManager.findOne
            .mockResolvedValueOnce(scenario.targetUser) // User found
            .mockResolvedValueOnce(null); // Post not found

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act & Assert
      await expect(
        service.createComment(scenario.currentUser!, 'non-existent-post', {
          content: 'New comment content',
        }),
      ).rejects.toThrow('Post not found');
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .withTargetComment(CommentMockProvider.createMockComment())
        .build();

      const mockStrategy = CommentMockProvider.createCommentStrategy();
      mockStrategy.canUpdateComment.mockReturnValue(true);
      mockStrategy.validateUpdateData.mockReturnValue(true);
      commentOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Mock transaction
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };

          mockManager.findOne
            .mockResolvedValueOnce(scenario.targetComment) // First call for comment
            .mockResolvedValueOnce(scenario.targetUser) // Second call for user
            .mockResolvedValueOnce({
              ...scenario.targetComment,
              content: 'Updated content',
            }); // Third call for updated comment

          mockManager.update.mockResolvedValue(undefined);

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act
      const result = await service.updateComment(
        scenario.currentUser!,
        'comment-uuid-123',
        { content: 'Updated content' },
      );

      // Assert
      expect(dataSource.transaction).toHaveBeenCalled();
      expect(result.content).toBe('Updated content');
    });

    it('should handle comment not found', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .build();

      // Mock transaction to return null for comment
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          };

          mockManager.findOne.mockResolvedValue(null); // Comment not found

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act & Assert
      await expect(
        service.updateComment(scenario.currentUser!, 'non-existent-comment', {
          content: 'Updated content',
        }),
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .withTargetComment(CommentMockProvider.createMockComment())
        .build();

      const mockStrategy = CommentMockProvider.createCommentStrategy();
      mockStrategy.canDeleteComment.mockReturnValue(true);
      commentOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Mock transaction with softDelete method
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          };

          mockManager.findOne
            .mockResolvedValueOnce(scenario.targetComment) // First call for comment
            .mockResolvedValueOnce(scenario.targetUser); // Second call for user

          mockManager.softDelete.mockResolvedValue(undefined);

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act
      await service.deleteComment(scenario.currentUser!, 'comment-uuid-123');

      // Assert
      expect(dataSource.transaction).toHaveBeenCalled();
    });

    it('should handle comment not found', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withCurrentUser({ uuid: 'user-uuid-123', role: { name: 'user' } })
        .withTargetUser(CommentMockProvider.createMockUser())
        .build();

      // Mock transaction to return null for comment
      dataSource.transaction.mockImplementation(
        async (
          isolationLevelOrCallback:
            | IsolationLevel
            | ((entityManager: EntityManager) => Promise<unknown>)
            | undefined,
          runInTransaction?: (entityManager: EntityManager) => Promise<unknown>,
        ) => {
          const callback =
            typeof isolationLevelOrCallback === 'function'
              ? isolationLevelOrCallback
              : runInTransaction!;

          const mockManager = {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          };

          mockManager.findOne.mockResolvedValue(null); // Comment not found

          return await callback(mockManager as unknown as EntityManager);
        },
      );

      // Act & Assert
      await expect(
        service.deleteComment(scenario.currentUser!, 'non-existent-comment'),
      ).rejects.toThrow('Comment not found');
    });
  });
});
