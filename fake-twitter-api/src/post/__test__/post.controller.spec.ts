/**
 * Post Controller Tests
 *
 * Tests the PostController class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from '../post.controller';
import { PostService } from '../services/post.service';
import { PostMapperService } from '../services/post-mapper.service';
import { PostMockProvider } from './mocks/post-mock.provider';
import { PostTestBuilder } from './mocks/post-test.builder';

describe('PostController', () => {
  let controller: PostController;
  let postService: any;
  let postMapper: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: {
            getAllPosts: jest.fn(),
            findById: jest.fn(),
            createPost: jest.fn(),
            updatePost: jest.fn(),
            deletePost: jest.fn(),
          },
        },
        {
          provide: PostMapperService,
          useValue: {
            toPostDto: jest.fn(),
            toPostDtoList: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<PostController>(PostController);
    postService = moduleRef.get<any>(PostService);
    postMapper = moduleRef.get<any>(PostMapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should get all posts with pagination successfully', async () => {
      // Arrange
      const posts = [PostMockProvider.createMockPost()];
      const scenario = new PostTestBuilder()
        .withPaginatedPosts(posts, 1, 20, 1)
        .build();

      const mockPostDto = { uuid: 'post-uuid', content: 'Test post' };
      const mockPostDtoList = [mockPostDto];

      postService.getAllPosts.mockResolvedValue(scenario.paginatedPosts);
      postMapper.toPostDtoList.mockReturnValue(mockPostDtoList);

      // Act
      const result = await controller.getAllPosts(1, 20);

      // Assert
      expect(postService.getAllPosts).toHaveBeenCalledWith(1, 20);
      expect(postMapper.toPostDtoList).toHaveBeenCalledWith(posts);
      expect(result).toEqual({
        data: mockPostDtoList,
        meta: scenario.paginatedPosts!.meta,
      });
    });

    it('should use default pagination values', async () => {
      // Arrange
      const posts = [PostMockProvider.createMockPost()];
      const scenario = new PostTestBuilder()
        .withPaginatedPosts(posts, 1, 20, 1)
        .build();

      postService.getAllPosts.mockResolvedValue(scenario.paginatedPosts);
      postMapper.toPostDtoList.mockReturnValue([]);

      // Act
      await controller.getAllPosts(1, 20);

      // Assert
      expect(postService.getAllPosts).toHaveBeenCalledWith(1, 20);
    });
  });

  describe('createPost', () => {
    it('should create post successfully', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withCreatePostScenario().build();

      const mockPost = PostMockProvider.createMockPost();
      const mockPostDto = { uuid: 'post-uuid', content: 'Test post' };

      postService.createPost.mockResolvedValue(mockPost);
      postMapper.toPostDto.mockReturnValue(mockPostDto);

      // Act
      const result = await controller.createPost(
        {
          sub: scenario.currentUser!.uuid,
          role: 'user',
          email: 'test@example.com',
          username: 'testuser',
          permissions: { read: true, write: true },
          sessionId: 'session-123',
        },
        scenario.createDto!,
      );

      // Assert
      expect(postService.createPost).toHaveBeenCalledWith(
        { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
        scenario.createDto,
      );
      expect(postMapper.toPostDto).toHaveBeenCalledWith(mockPost);
      expect(result).toEqual({ post: mockPostDto });
    });
  });

  describe('getPost', () => {
    it('should get single post successfully', async () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withTargetPost(PostMockProvider.createMockPost())
        .build();

      const mockPostDto = { uuid: 'post-uuid', content: 'Test post' };

      postService.findById.mockResolvedValue(scenario.targetPost);
      postMapper.toPostDto.mockReturnValue(mockPostDto);

      // Act
      const result = await controller.getPost(
        {
          sub: 'user-uuid',
          role: 'user',
          email: 'test@example.com',
          username: 'testuser',
          permissions: { read: true },
          sessionId: 'session-123',
        },
        scenario.targetPost!.uuid,
      );

      // Assert
      expect(postService.findById).toHaveBeenCalledWith(
        scenario.targetPost!.uuid,
        { uuid: 'user-uuid', role: { name: 'user' } },
      );
      expect(postMapper.toPostDto).toHaveBeenCalledWith(scenario.targetPost);
      expect(result).toEqual({ post: mockPostDto });
    });
  });

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withUpdatePostScenario().build();

      const updatedPost = PostMockProvider.createMockPost({
        content: 'Updated content',
      });
      const mockPostDto = { uuid: 'post-uuid', content: 'Updated content' };

      postService.updatePost.mockResolvedValue(updatedPost);
      postMapper.toPostDto.mockReturnValue(mockPostDto);

      // Act
      const result = await controller.updatePost(
        {
          sub: scenario.currentUser!.uuid,
          role: 'user',
          email: 'test@example.com',
          username: 'testuser',
          permissions: { read: true, write: true },
          sessionId: 'session-123',
        },
        scenario.targetPost!.uuid,
        scenario.updateDto!,
      );

      // Assert
      expect(postService.updatePost).toHaveBeenCalledWith(
        { uuid: scenario.currentUser!.uuid, role: { name: 'user' } },
        scenario.targetPost!.uuid,
        scenario.updateDto,
      );
      expect(postMapper.toPostDto).toHaveBeenCalledWith(updatedPost);
      expect(result).toEqual({ post: mockPostDto });
    });
  });

  describe('deletePost', () => {
    it('should delete post successfully', async () => {
      // Arrange
      const scenario = new PostTestBuilder().withAdminUserScenario().build();

      postService.deletePost.mockResolvedValue(undefined);

      // Act
      const result = await controller.deletePost(
        {
          sub: scenario.currentUser!.uuid,
          role: 'admin',
          email: 'test@example.com',
          username: 'testuser',
          permissions: { read: true, write: true, delete: true },
          sessionId: 'session-123',
        },
        scenario.targetPost!.uuid,
      );

      // Assert
      expect(postService.deletePost).toHaveBeenCalledWith(
        { uuid: scenario.currentUser!.uuid, role: { name: 'admin' } },
        scenario.targetPost!.uuid,
      );
      expect(result).toEqual({ message: 'Post deleted successfully' });
    });
  });
});
