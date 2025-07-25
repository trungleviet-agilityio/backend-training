/**
 * Post Mapper Service Tests
 *
 * Tests the PostMapperService class
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PostMapperService } from '../services/post-mapper.service';
import { PostMockProvider } from './mocks/post-mock.provider';
import { PostTestBuilder } from './mocks/post-test.builder';
import { Post } from '../../database/entities/post.entity';

describe('PostMapperService', () => {
  let service: PostMapperService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PostMapperService],
    }).compile();

    service = moduleRef.get<PostMapperService>(PostMapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toPostDto', () => {
    it('should map post entity to DTO successfully', () => {
      // Arrange
      const scenario = new PostTestBuilder()
        .withTargetPost(PostMockProvider.createMockPost())
        .build();

      // Act
      const result = service.toPostDto(scenario.targetPost!);

      // Assert
      expect(result).toEqual({
        uuid: scenario.targetPost!.uuid,
        content: scenario.targetPost!.content,
        isPublished: scenario.targetPost!.isPublished,
        createdAt: scenario.targetPost!.createdAt,
        updatedAt: scenario.targetPost!.updatedAt,
        author: {
          uuid: scenario.targetPost!.author.uuid,
          username: scenario.targetPost!.author.username,
          firstName: scenario.targetPost!.author.firstName || '',
          lastName: scenario.targetPost!.author.lastName || '',
          avatarUrl: scenario.targetPost!.author.avatarUrl,
        },
        stats: {
          likesCount: scenario.targetPost!.likesCount,
          commentsCount: scenario.targetPost!.commentsCount,
        },
      });
    });

    it('should handle post with minimal author data', () => {
      // Arrange
      const post = PostMockProvider.createMockPost({
        content: 'Minimal post',
        isPublished: false,
      });
      post.author.firstName = undefined;
      post.author.lastName = undefined;
      post.author.avatarUrl = undefined;

      // Act
      const result = service.toPostDto(post);

      // Assert
      expect(result.content).toBe('Minimal post');
      expect(result.isPublished).toBe(false);
      expect(result.author.firstName).toBe('');
      expect(result.author.lastName).toBe('');
      expect(result.author.avatarUrl).toBeUndefined();
    });

    it('should handle post with high stats', () => {
      // Arrange
      const post = PostMockProvider.createMockPost({
        likesCount: 1000,
        commentsCount: 500,
      });

      // Act
      const result = service.toPostDto(post);

      // Assert
      expect(result.stats.likesCount).toBe(1000);
      expect(result.stats.commentsCount).toBe(500);
    });
  });

  describe('toPostDtoList', () => {
    it('should map list of posts to DTOs successfully', () => {
      // Arrange
      const posts = [
        PostMockProvider.createMockPost({ content: 'First post' }),
        PostMockProvider.createMockPost({ content: 'Second post' }),
      ];

      // Act
      const result = service.toPostDtoList(posts);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('First post');
      expect(result[1].content).toBe('Second post');
      expect(result[0]).toHaveProperty('uuid');
      expect(result[0]).toHaveProperty('author');
      expect(result[0]).toHaveProperty('stats');
      expect(result[1]).toHaveProperty('uuid');
      expect(result[1]).toHaveProperty('author');
      expect(result[1]).toHaveProperty('stats');
    });

    it('should handle empty posts list', () => {
      // Arrange
      const posts: Post[] = [];

      // Act
      const result = service.toPostDtoList(posts);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle single post', () => {
      // Arrange
      const posts = [
        PostMockProvider.createMockPost({ content: 'Single post' }),
      ];

      // Act
      const result = service.toPostDtoList(posts);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('Single post');
      expect(result[0]).toHaveProperty('author');
      expect(result[0]).toHaveProperty('stats');
    });
  });

  describe('Edge Cases', () => {
    it('should handle post with missing author fields', () => {
      // Arrange
      const post = PostMockProvider.createMockPost();
      post.author.firstName = undefined;
      post.author.lastName = undefined;
      post.author.avatarUrl = undefined;

      // Act
      const result = service.toPostDto(post);

      // Assert
      expect(result.author.firstName).toBe('');
      expect(result.author.lastName).toBe('');
      expect(result.author.avatarUrl).toBeUndefined();
    });

    it('should handle post with zero stats', () => {
      // Arrange
      const post = PostMockProvider.createMockPost({
        likesCount: 0,
        commentsCount: 0,
      });

      // Act
      const result = service.toPostDto(post);

      // Assert
      expect(result.stats.likesCount).toBe(0);
      expect(result.stats.commentsCount).toBe(0);
    });
  });
});
