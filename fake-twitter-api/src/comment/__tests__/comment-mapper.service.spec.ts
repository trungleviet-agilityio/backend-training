/**
 * CommentMapperService Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CommentMapperService } from '../services/comment-mapper.service';
import { Comment } from '../../database/entities/comment.entity';
import { User } from '../../database/entities/user.entity';
import { CommentMockProvider } from './mocks/comment-mock.provider';

describe('CommentMapperService', () => {
  let service: CommentMapperService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [CommentMapperService],
    }).compile();

    service = moduleRef.get<CommentMapperService>(CommentMapperService);
  });

  describe('toCommentDto', () => {
    it('should map comment to CommentDto successfully', () => {
      // Arrange
      const mockComment = CommentMockProvider.createMockComment();

      // Act
      const result = service.toCommentDto(mockComment);

      // Assert
      expect(result).toEqual({
        uuid: 'comment-uuid-123',
        content: 'Test comment content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        stats: {
          likesCount: 0,
        },
        depthLevel: 0,
        parentUuid: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should handle comment with null author fields', () => {
      // Arrange
      const mockComment = CommentMockProvider.createMockComment({
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: null,
          lastName: null,
          avatarUrl: null,
          role: { name: 'user' },
        } as unknown as User,
      });

      // Act
      const result = service.toCommentDto(mockComment);

      // Assert
      expect(result.author).toEqual({
        uuid: 'user-uuid-123',
        username: 'testuser',
        firstName: '',
        lastName: '',
        avatarUrl: null,
      });
    });

    it('should handle comment with replies', () => {
      // Arrange
      const mockComment = CommentMockProvider.createMockComment({
        replies: [CommentMockProvider.createMockComment()],
      });

      // Act
      const result = service.toCommentDto(mockComment);

      // Assert
      expect(result.uuid).toBe('comment-uuid-123');
      expect(result.content).toBe('Test comment content');
      expect(result.author).toBeDefined();
      expect(result.stats).toBeDefined();
    });
  });

  describe('toCommentDtoList', () => {
    it('should map list of comments to CommentDto list successfully', () => {
      // Arrange
      const mockComments = [
        CommentMockProvider.createMockComment(),
        CommentMockProvider.createMockComment({ uuid: 'comment-uuid-456' }),
      ];

      // Act
      const result = service.toCommentDtoList(mockComments);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].uuid).toBe('comment-uuid-123');
      expect(result[1].uuid).toBe('comment-uuid-456');
      expect(result[0]).toEqual({
        uuid: 'comment-uuid-123',
        content: 'Test comment content',
        author: {
          uuid: 'user-uuid-123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        stats: {
          likesCount: 0,
        },
        depthLevel: 0,
        parentUuid: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should handle empty list', () => {
      // Arrange
      const mockComments: Comment[] = [];

      // Act
      const result = service.toCommentDtoList(mockComments);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle single comment', () => {
      // Arrange
      const mockComments = [CommentMockProvider.createMockComment()];

      // Act
      const result = service.toCommentDtoList(mockComments);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].uuid).toBe('comment-uuid-123');
    });
  });
});
