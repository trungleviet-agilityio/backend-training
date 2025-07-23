/**
 * CommentController Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentController } from '../comment.controller';
import { CommentService } from '../services/comment.service';
import { CommentMapperService } from '../services/comment-mapper.service';
import { CommentTestBuilder } from './mocks/comment-test.builder';
import { CommentMockProvider } from './mocks/comment-mock.provider';
import { IJwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentDto } from '../dto/comment-response.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: jest.Mocked<CommentService>;
  let commentMapperService: jest.Mocked<CommentMapperService>;

  beforeEach(async () => {
    const mockCommentService = CommentMockProvider.createCommentService();
    const mockCommentMapperService =
      CommentMockProvider.createCommentMapperService();

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: CommentMapperService, useValue: mockCommentMapperService },
      ],
    }).compile();

    controller = moduleRef.get<CommentController>(CommentController);
    commentService = moduleRef.get(CommentService);
    commentMapperService = moduleRef.get(CommentMapperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPostComments', () => {
    it('should get post comments successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withPaginatedComments({
          data: [CommentMockProvider.createMockComment()],
          meta: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        })
        .withCommentDtos([
          {
            uuid: 'comment-uuid-123',
            content: 'Test comment',
            author: {
              uuid: 'user-uuid-123',
              username: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            stats: { likesCount: 0 },
            depthLevel: 0,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
          },
        ])
        .build();

      commentService.getPostComments.mockResolvedValue(
        scenario.paginatedComments!,
      );
      commentMapperService.toCommentDtoList.mockReturnValue(
        scenario.commentDtos!,
      );

      // Act
      const result = await controller.getPostComments('post-uuid-123', 1, 20);

      // Assert
      expect(commentService.getPostComments).toHaveBeenCalledWith(
        'post-uuid-123',
        1,
        20,
      );
      expect(commentMapperService.toCommentDtoList).toHaveBeenCalledWith(
        scenario.paginatedComments!.data,
      );
      expect(result).toEqual({
        items: scenario.commentDtos,
        meta: scenario.paginatedComments!.meta,
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      commentService.getPostComments.mockRejectedValue(
        new NotFoundException('Post not found'),
      );

      // Act & Assert
      await expect(
        controller.getPostComments('non-existent-post', 1, 20),
      ).rejects.toThrow('Post not found');
    });
  });

  describe('createComment', () => {
    it('should create comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .withCreateDto({ content: 'New comment content' })
        .withTargetComment(CommentMockProvider.createMockComment())
        .withCommentDto({
          uuid: 'comment-uuid-123',
          content: 'New comment content',
          author: {
            uuid: 'user-uuid-123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          stats: { likesCount: 0 },
          depthLevel: 0,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        })
        .build();

      commentService.createComment.mockResolvedValue(scenario.targetComment!);
      commentMapperService.toCommentDto.mockReturnValue(scenario.commentDto!);

      // Act
      const result = await controller.createComment(
        scenario.jwtPayload!,
        'post-uuid-123',
        scenario.createDto!,
      );

      // Assert
      expect(commentService.createComment).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'post-uuid-123',
        scenario.createDto,
      );
      expect(commentMapperService.toCommentDto).toHaveBeenCalledWith(
        scenario.targetComment,
      );
      expect(result).toEqual({ comment: scenario.commentDto });
    });

    it('should handle service errors', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .withCreateDto({ content: 'New comment content' })
        .build();

      commentService.createComment.mockRejectedValue(
        new ForbiddenException('You cannot comment'),
      );

      // Act & Assert
      await expect(
        controller.createComment(
          scenario.jwtPayload!,
          'post-uuid-123',
          scenario.createDto!,
        ),
      ).rejects.toThrow('You cannot comment');
    });
  });

  describe('updateComment', () => {
    it('should update comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .withUpdateDto({ content: 'Updated comment content' })
        .withTargetComment(CommentMockProvider.createMockComment())
        .withCommentDto({
          uuid: 'comment-uuid-123',
          content: 'Updated comment content',
          author: {
            uuid: 'user-uuid-123',
            username: 'testuser',
            firstName: 'Test',
            lastName: 'User',
            avatarUrl: 'https://example.com/avatar.jpg',
          },
          stats: { likesCount: 0 },
          depthLevel: 0,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        })
        .build();

      commentService.updateComment.mockResolvedValue(scenario.targetComment!);
      commentMapperService.toCommentDto.mockReturnValue(scenario.commentDto!);

      // Act
      const result = await controller.updateComment(
        scenario.jwtPayload!,
        'comment-uuid-123',
        scenario.updateDto!,
      );

      // Assert
      expect(commentService.updateComment).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'comment-uuid-123',
        scenario.updateDto,
      );
      expect(commentMapperService.toCommentDto).toHaveBeenCalledWith(
        scenario.targetComment,
      );
      expect(result).toEqual({ comment: scenario.commentDto });
    });

    it('should handle service errors', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .withUpdateDto({ content: 'Updated comment content' })
        .build();

      commentService.updateComment.mockRejectedValue(
        new ForbiddenException('You cannot update this comment'),
      );

      // Act & Assert
      await expect(
        controller.updateComment(
          scenario.jwtPayload!,
          'comment-uuid-123',
          scenario.updateDto!,
        ),
      ).rejects.toThrow('You cannot update this comment');
    });
  });

  describe('deleteComment', () => {
    it('should delete comment successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .build();

      commentService.deleteComment.mockResolvedValue(undefined);

      // Act
      const result = await controller.deleteComment(
        scenario.jwtPayload!,
        'comment-uuid-123',
      );

      // Assert
      expect(commentService.deleteComment).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: scenario.jwtPayload!.sub,
          role: { name: scenario.jwtPayload!.role },
        }),
        'comment-uuid-123',
      );
      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should handle service errors', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .build();

      commentService.deleteComment.mockRejectedValue(
        new ForbiddenException('You cannot delete this comment'),
      );

      // Act & Assert
      await expect(
        controller.deleteComment(scenario.jwtPayload!, 'comment-uuid-123'),
      ).rejects.toThrow('You cannot delete this comment');
    });
  });

  describe('getCommentReplies', () => {
    it('should get comment replies successfully', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withPaginatedComments({
          data: [CommentMockProvider.createMockComment()],
          meta: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        })
        .withCommentDtos([
          {
            uuid: 'reply-uuid-123',
            content: 'Test reply',
            author: {
              uuid: 'user-uuid-123',
              username: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            stats: { likesCount: 0 },
            depthLevel: 0,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
          },
        ])
        .build();

      commentService.getCommentReplies.mockResolvedValue(
        scenario.paginatedComments!,
      );
      commentMapperService.toCommentDtoList.mockReturnValue(
        scenario.commentDtos!,
      );

      // Act
      const result = await controller.getCommentReplies(
        'comment-uuid-123',
        1,
        20,
      );

      // Assert
      expect(commentService.getCommentReplies).toHaveBeenCalledWith(
        'comment-uuid-123',
        1,
        20,
      );
      expect(commentMapperService.toCommentDtoList).toHaveBeenCalledWith(
        scenario.paginatedComments!.data,
      );
      expect(result).toEqual({
        items: scenario.commentDtos,
        meta: scenario.paginatedComments!.meta,
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      commentService.getCommentReplies.mockRejectedValue(
        new NotFoundException('Comment not found'),
      );

      // Act & Assert
      await expect(
        controller.getCommentReplies('non-existent-comment', 1, 20),
      ).rejects.toThrow('Comment not found');
    });
  });

  describe('JWT payload transformation', () => {
    it('should transform JWT payload correctly for create comment', async () => {
      // Arrange
      const jwtPayload: IJwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'user',
        permissions: {},
        sessionId: 'session-123',
      };

      const createDto: CreateCommentDto = {
        content: 'Test comment',
        parent_uuid: null,
      };

      const mockComment = CommentMockProvider.createMockComment();
      const mockCommentDto = {
        uuid: 'comment-uuid-123',
        content: 'Test comment',
      };

      commentService.createComment.mockResolvedValue(mockComment);
      commentMapperService.toCommentDto.mockReturnValue(
        mockCommentDto as unknown as CommentDto,
      );

      // Act
      await controller.createComment(jwtPayload, 'post-uuid-123', createDto);

      // Assert
      expect(commentService.createComment).toHaveBeenCalledWith(
        {
          uuid: 'user-uuid-123',
          role: { name: 'user' },
        },
        'post-uuid-123',
        createDto,
      );
    });

    it('should transform JWT payload correctly for update comment', async () => {
      // Arrange
      const jwtPayload: IJwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'admin',
        permissions: {},
        sessionId: 'session-123',
      };

      const updateDto: UpdateCommentDto = {
        content: 'Updated comment',
      };

      const mockComment = CommentMockProvider.createMockComment();
      const mockCommentDto = {
        uuid: 'comment-uuid-123',
        content: 'Updated comment',
      };

      commentService.updateComment.mockResolvedValue(mockComment);
      commentMapperService.toCommentDto.mockReturnValue(
        mockCommentDto as unknown as CommentDto,
      );

      // Act
      await controller.updateComment(jwtPayload, 'comment-uuid-123', updateDto);

      // Assert
      expect(commentService.updateComment).toHaveBeenCalledWith(
        {
          uuid: 'user-uuid-123',
          role: { name: 'admin' },
        },
        'comment-uuid-123',
        updateDto,
      );
    });

    it('should transform JWT payload correctly for delete comment', async () => {
      // Arrange
      const jwtPayload: IJwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@example.com',
        username: 'testuser',
        role: 'moderator',
        permissions: {},
        sessionId: 'session-123',
      };

      commentService.deleteComment.mockResolvedValue(undefined);

      // Act
      await controller.deleteComment(jwtPayload, 'comment-uuid-123');

      // Assert
      expect(commentService.deleteComment).toHaveBeenCalledWith(
        {
          uuid: 'user-uuid-123',
          role: { name: 'moderator' },
        },
        'comment-uuid-123',
      );
    });
  });

  describe('Query parameters', () => {
    it('should handle pagination parameters correctly for getPostComments', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withPaginatedComments({
          data: [CommentMockProvider.createMockComment()],
          meta: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        })
        .withCommentDtos([
          {
            uuid: 'comment-uuid-123',
            content: 'Test comment',
            author: {
              uuid: 'user-uuid-123',
              username: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            stats: { likesCount: 0 },
            depthLevel: 0,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
          },
        ])
        .build();

      commentService.getPostComments.mockResolvedValue(
        scenario.paginatedComments!,
      );
      commentMapperService.toCommentDtoList.mockReturnValue(
        scenario.commentDtos!,
      );

      // Act
      await controller.getPostComments('post-uuid-123', 2, 10);

      // Assert
      expect(commentService.getPostComments).toHaveBeenCalledWith(
        'post-uuid-123',
        2,
        10,
      );
    });

    it('should handle pagination parameters correctly for getCommentReplies', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withPaginatedComments({
          data: [CommentMockProvider.createMockComment()],
          meta: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        })
        .withCommentDtos([
          {
            uuid: 'reply-uuid-123',
            content: 'Test reply',
            author: {
              uuid: 'user-uuid-123',
              username: 'testuser',
              firstName: 'Test',
              lastName: 'User',
              avatarUrl: 'https://example.com/avatar.jpg',
            },
            stats: { likesCount: 0 },
            depthLevel: 0,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
          },
        ])
        .build();

      commentService.getCommentReplies.mockResolvedValue(
        scenario.paginatedComments!,
      );
      commentMapperService.toCommentDtoList.mockReturnValue(
        scenario.commentDtos!,
      );

      // Act
      await controller.getCommentReplies('comment-uuid-123', 3, 5);

      // Assert
      expect(commentService.getCommentReplies).toHaveBeenCalledWith(
        'comment-uuid-123',
        3,
        5,
      );
    });
  });

  describe('Error handling', () => {
    it('should handle NotFoundException from service', async () => {
      // Arrange
      commentService.getPostComments.mockRejectedValue(
        new NotFoundException('Post not found'),
      );

      // Act & Assert
      await expect(
        controller.getPostComments('non-existent-post', 1, 20),
      ).rejects.toThrow('Post not found');
    });

    it('should handle ForbiddenException from service', async () => {
      // Arrange
      const scenario = new CommentTestBuilder()
        .withJwtPayload({ sub: 'user-uuid-123', role: 'user' } as IJwtPayload)
        .withCreateDto({ content: 'Test comment' })
        .build();

      commentService.createComment.mockRejectedValue(
        new ForbiddenException('Insufficient permissions'),
      );

      // Act & Assert
      await expect(
        controller.createComment(
          scenario.jwtPayload!,
          'post-uuid-123',
          scenario.createDto!,
        ),
      ).rejects.toThrow('Insufficient permissions');
    });

    it('should handle generic errors from service', async () => {
      // Arrange
      commentService.getPostComments.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(
        controller.getPostComments('post-uuid-123', 1, 20),
      ).rejects.toThrow('Database connection failed');
    });
  });
});
