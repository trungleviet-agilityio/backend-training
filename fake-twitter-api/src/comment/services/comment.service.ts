/**
 * Comment service
 */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Comment, Post, User } from '../../database/entities';
import { CommentOperationFactory } from '../factories/comment-operation.factory';
import { CreateCommentDto, UpdateCommentDto } from '../dto';
import { PaginatedComments } from '../interfaces';
import { CommentMapperService } from './comment-mapper.service';

@Injectable()
export class CommentService {
  /**
   * Constructor
   * @param commentRepository - The repository for the comment entity
   * @param userRepository - The repository for the user entity
   * @param postRepository - The repository for the post entity
   * @param dataSource - The data source for transactions
   * @param commentOperationFactory - The factory for the comment operation
   * @param commentMapper - The mapper for the comment
   */

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly dataSource: DataSource,
    private readonly commentOperationFactory: CommentOperationFactory,
    private readonly commentMapper: CommentMapperService,
  ) {}

  async findById(uuid: string): Promise<Comment> {
    /**
     * Find a comment by its UUID
     * @param uuid - The UUID of the comment
     * @returns The comment
     */

    const comment = await this.commentRepository.findOne({
      where: { uuid },
      relations: ['author', 'post', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async getPostComments(postUuid: string, page: number, limit: number): Promise<PaginatedComments> {
    /**
     * Get comments for a post
     * @param postUuid - The UUID of the post
     * @param page - The page number
     * @param limit - The number of comments per page
     * @returns Paginated comments
     */

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { postUuid, parentUuid: undefined },
      relations: ['author', 'replies'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCommentReplies(commentUuid: string, page: number, limit: number): Promise<PaginatedComments> {
    /**
     * Get replies for a comment
     * @param commentUuid - The UUID of the comment
     * @param page - The page number
     * @param limit - The number of replies per page
     * @returns Paginated replies
     */

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { parentUuid: commentUuid },
      relations: ['author', 'replies'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'ASC' },
    });

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createComment(currentUser: { uuid: string; role: { name: string } }, postUuid: string, createData: CreateCommentDto): Promise<Comment> {
    /**
     * Create a new comment with transaction
     * @param currentUser - The current user
     * @param postUuid - The UUID of the post
     * @param createData - The comment data
     * @returns The created comment
     */

    // Use transaction to ensure data consistency
    return await this.dataSource.transaction(async (manager) => {
      // Get user with role
      const user = await manager.findOne(User, {
        where: { uuid: currentUser.uuid },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get post
      const post = await manager.findOne(Post, {
        where: { uuid: postUuid },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check permissions
      const strategy = this.commentOperationFactory.createStrategy(currentUser.role.name);
      
      if (!strategy.canCreateComment(user, post.authorUuid)) {
        throw new ForbiddenException('You cannot comment');
      }

      if (!strategy.validateCreateData(user, createData)) {
        throw new ForbiddenException('Invalid comment data');
      }

      // Create comment
      const comment = manager.create(Comment, {
        content: createData.content,
        authorUuid: user.uuid,
        postUuid: postUuid,
        parentUuid: createData.parent_uuid || undefined,
        depthLevel: createData.parent_uuid ? 1 : 0,
        likesCount: 0,
      });

      // Save comment
      const savedComment = await manager.save(Comment, comment);

      // Return comment with relations loaded
      const commentWithRelations = await manager.findOne(Comment, {
        where: { uuid: savedComment.uuid },
        relations: ['author', 'post'],
      });

      if (!commentWithRelations) {
        throw new NotFoundException('Comment not found after creation');
      }

      return commentWithRelations;
    });
  }

  async updateComment(currentUser: { uuid: string; role: { name: string } }, commentUuid: string, updateData: UpdateCommentDto): Promise<Comment> {
    /**
     * Update a comment with transaction
     * @param currentUser - The current user
     * @param commentUuid - The UUID of the comment
     * @param updateData - The data to update
     * @returns The updated comment
     */

    return await this.dataSource.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { uuid: commentUuid },
        relations: ['author', 'post'],
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const user = await manager.findOne(User, {
        where: { uuid: currentUser.uuid },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const strategy = this.commentOperationFactory.createStrategy(currentUser.role.name);

      if (!strategy.canUpdateComment(user, comment)) {
        throw new ForbiddenException('You cannot update this comment');
      }

      if (!strategy.validateUpdateData(user, comment, updateData)) {
        throw new ForbiddenException('Invalid update data');
      }

      await manager.update(Comment, commentUuid, { content: updateData.content });

      const updatedComment = await manager.findOne(Comment, {
        where: { uuid: commentUuid },
        relations: ['author', 'post'],
      });

      if (!updatedComment) {
        throw new NotFoundException('Comment not found after update');
      }

      return updatedComment;
    });
  }

  async deleteComment(currentUser: { uuid: string; role: { name: string } }, commentUuid: string): Promise<void> {
    /**
     * Delete a comment with transaction
     * @param currentUser - The current user
     * @param commentUuid - The UUID of the comment
     */

    await this.dataSource.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { uuid: commentUuid },
        relations: ['author', 'post'],
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      const user = await manager.findOne(User, {
        where: { uuid: currentUser.uuid },
        relations: ['role'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const strategy = this.commentOperationFactory.createStrategy(currentUser.role.name);

      if (!strategy.canDeleteComment(user, comment)) {
        throw new ForbiddenException('You cannot delete this comment');
      }

      await manager.softDelete(Comment, commentUuid);
    });
  }
}
