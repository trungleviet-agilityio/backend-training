/**
 * Post service unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { PostService } from '../services/post.service';
import { PostMapperService } from '../services/post-mapper.service';
import { PostOperationFactory } from '../factories/post-operation.factory';
import { PostMockProvider } from './mocks/post-mock.provider';
import { PostTestBuilder } from './mocks/post-test.builder';
import { Repository, UpdateResult } from 'typeorm';

describe('PostService', () => {
  let postService: jest.Mocked<PostService>;
  let postRepository: jest.Mocked<Repository<Post>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let postOperationFactory: jest.Mocked<PostOperationFactory>;
  let postMapper: jest.Mocked<PostMapperService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findOne: jest.fn() as jest.MockedFunction<any>,
            findAndCount: jest.fn() as jest.MockedFunction<any>,
            create: jest.fn() as jest.MockedFunction<any>,
            save: jest.fn() as jest.MockedFunction<any>,
            update: jest.fn() as jest.MockedFunction<any>,
            softRemove: jest.fn() as jest.MockedFunction<any>,
            softDelete: jest.fn() as jest.MockedFunction<any>,
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn() as jest.MockedFunction<any>,
          },
        },
        {
          provide: PostOperationFactory,
          useValue: {
            createStrategy: jest.fn() as jest.MockedFunction<any>,
          },
        },
        {
          provide: PostMapperService,
          useValue: {
            toPostDto: jest.fn() as jest.MockedFunction<any>,
            toPostDtoList: jest.fn() as jest.MockedFunction<any>,
          },
        },
      ],
    }).compile();

    postService = moduleRef.get<jest.Mocked<PostService>>(PostService);
    postRepository = moduleRef.get<jest.Mocked<Repository<Post>>>(
      getRepositoryToken(Post),
    );
    userRepository = moduleRef.get<jest.Mocked<Repository<User>>>(
      getRepositoryToken(User),
    );
    postOperationFactory =
      moduleRef.get<jest.Mocked<PostOperationFactory>>(PostOperationFactory);
    postMapper =
      moduleRef.get<jest.Mocked<PostMapperService>>(PostMapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should find post by UUID successfully', async () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withTargetPost(PostMockProvider.createMockPost())
        .build();

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);

      // Act
      const result = await postService.findById(scenario.targetPost!.uuid);

      // Assert
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.targetPost!.uuid },
        relations: ['author'],
      });
      expect(result).toEqual(scenario.targetPost);
    });

    it('should handle post not found scenario', async () => {
      // Arrange
      postRepository.findOne.mockResolvedValue(null as unknown as Post);

      // Act & Assert
      await expect(postService.findById('non-existent-uuid')).rejects.toThrow(
        'Post not found',
      );
    });

    it('should check permissions when current user is provided', async () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withCurrentUser(PostMockProvider.createMockUser())
        .withTargetPost(PostMockProvider.createMockPost())
        .build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act
      const result = await postService.findById(scenario.targetPost!.uuid, {
        uuid: scenario.currentUser!.uuid,
        role: { name: 'user' },
      });

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.currentUser!.uuid },
        relations: ['role'],
      });
      expect(mockStrategy.canViewPost).toHaveBeenCalledWith(
        scenario.currentUser,
        scenario.targetPost,
      );
      expect(result).toEqual(scenario.targetPost);
    });

    it('should throw forbidden error when user cannot view post', async () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withCurrentUser(PostMockProvider.createMockUser())
        .withTargetPost(PostMockProvider.createMockPost())
        .build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(false),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        postService.findById(scenario.targetPost!.uuid, {
          uuid: scenario.currentUser!.uuid,
          role: { name: 'user' },
        }),
      ).rejects.toThrow('You cannot view this post');
    });
  });

  describe('getAllPosts', () => {
    it('should get all published posts with pagination successfully', async () => {
      // Arrange
      const posts = [PostMockProvider.createMockPost()];
      const scenario = new PostTestBuilder()
        .withPaginatedPosts(posts, 1, 10, 1)
        .build();

      postRepository.findAndCount.mockResolvedValue([posts, 1] as [
        Post[],
        number,
      ]);

      // Act
      const result = await postService.getAllPosts(1, 10);

      // Assert
      expect(postRepository.findAndCount).toHaveBeenCalledWith({
        where: { isPublished: true },
        relations: ['author'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(scenario.paginatedPosts);
    });

    it('should handle empty posts list', async () => {
      // Arrange
      postRepository.findAndCount.mockResolvedValue([[], 0] as [
        Post[],
        number,
      ]);

      // Act
      const result = await postService.getAllPosts(1, 10);

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('createPost', () => {
    it('should create post successfully with valid permissions', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withCreatePostScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };
      const createdPost = PostMockProvider.createMockPost();

      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);
      postRepository.create.mockReturnValue(createdPost);
      postRepository.save.mockResolvedValue(createdPost);
      postRepository.findOne.mockResolvedValue(createdPost);

      // Act
      const result = await postService.createPost(
        { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
        scenario.createDto!,
      );

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: scenario.currentUser!.uuid },
        relations: ['role'],
      });
      expect(mockStrategy.canCreatePost).toHaveBeenCalledWith(
        scenario.currentUser,
      );
      expect(mockStrategy.validateCreateData).toHaveBeenCalledWith(
        scenario.currentUser,
        scenario.createDto,
      );
      expect(postRepository.create).toHaveBeenCalledWith({
        ...scenario.createDto,
        authorUuid: scenario.currentUser!.uuid,
      });
      expect(result).toEqual(createdPost);
    });

    it('should handle insufficient permissions for create', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withCreatePostScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(false),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        postService.createPost(
          { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
          scenario.createDto!,
        ),
      ).rejects.toThrow('You cannot create posts');
    });

    it('should handle invalid create data', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withCreatePostScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(false),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        postService.createPost(
          { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
          scenario.createDto!,
        ),
      ).rejects.toThrow('Invalid post data for your role');
    });
  });

  describe('updatePost', () => {
    it('should update post successfully with valid permissions', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withUpdatePostScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };
      const updatedPost = PostMockProvider.createMockPost({
        content: 'Updated content',
      });

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);
      postRepository.update.mockResolvedValue({ affected: 1 } as any);
      postRepository.findOne.mockResolvedValue(updatedPost);

      // Act
      const result = await postService.updatePost(
        { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
        scenario.targetPost!.uuid,
        scenario.updateDto!,
      );

      // Assert
      expect(mockStrategy.canUpdatePost).toHaveBeenCalledWith(
        scenario.currentUser,
        updatedPost,
      );
      expect(mockStrategy.validateUpdateData).toHaveBeenCalledWith(
        scenario.currentUser,
        updatedPost,
        scenario.updateDto,
      );
      expect(postRepository.update).toHaveBeenCalledWith(
        scenario.targetPost!.uuid,
        scenario.updateDto,
      );
      expect(result).toEqual(updatedPost);
    });

    it('should handle insufficient permissions for update', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withUpdatePostScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(false),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        postService.updatePost(
          { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
          scenario.targetPost!.uuid,
          scenario.updateDto!,
        ),
      ).rejects.toThrow('You cannot update this post');
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully with valid permissions', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(true),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);
      postRepository.softDelete.mockResolvedValue({
        affected: 1,
        raw: [],
        generatedMaps: [],
      } as unknown as UpdateResult);

      // Act
      await postService.deletePost(
        {
          uuid: scenario.currentUser!.uuid,
          role: { name: 'admin' },
        },
        scenario.targetPost!.uuid,
      );

      // Assert
      expect(mockStrategy.canDeletePost).toHaveBeenCalledWith(
        scenario.currentUser,
        scenario.targetPost,
      );
      expect(postRepository.softDelete).toHaveBeenCalledWith(
        scenario.targetPost!.uuid,
      );
    });

    it('should handle insufficient permissions for delete', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withRegularUserScenario().build();

      const mockStrategy = {
        canViewPost: jest.fn().mockReturnValue(true),
        canCreatePost: jest.fn().mockReturnValue(true),
        canUpdatePost: jest.fn().mockReturnValue(true),
        canDeletePost: jest.fn().mockReturnValue(false),
        validateCreateData: jest.fn().mockReturnValue(true),
        validateUpdateData: jest.fn().mockReturnValue(true),
      };

      postRepository.findOne.mockResolvedValue(scenario.targetPost!);
      userRepository.findOne.mockResolvedValue(scenario.currentUser!);
      postOperationFactory.createStrategy.mockReturnValue(mockStrategy);

      // Act & Assert
      await expect(
        postService.deletePost(
          { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
          scenario.targetPost!.uuid,
        ),
      ).rejects.toThrow('You cannot delete this post');
    });
  });

  describe('getUserPosts', () => {
    it('should get user posts with pagination successfully', async () => {
      // Arrange
      const posts = [PostMockProvider.createMockPost()];
      const scenario = new PostTestBuilder()
        .withPaginatedPosts(posts, 1, 10, 1)
        .build();

      postRepository.findAndCount.mockResolvedValue([posts, 1] as [
        Post[],
        number,
      ]);

      // Act
      const result = await postService.getUserPosts('user-uuid-123', 1, 10);

      // Assert
      expect(postRepository.findAndCount).toHaveBeenCalledWith({
        where: { authorUuid: 'user-uuid-123', isPublished: true },
        relations: ['author'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(scenario.paginatedPosts);
    });
  });
});
