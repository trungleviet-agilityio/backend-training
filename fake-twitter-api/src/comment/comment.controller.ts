/**
 * Comment controller
 */

import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CommentMapperService, CommentService } from './services';
import {
  CommentResponseDto,
  CommentsResponseDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto';

@ApiTags('Comments')
@Controller('')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
  /**
   * Constructor
   * @param commentService - The service for the comment
   * @param commentMapper - The mapper for the comment
   */

  constructor(
    private readonly commentService: CommentService,
    private readonly commentMapper: CommentMapperService,
  ) {}

  @Get('posts/:uuid/comments')
  @ApiOperation({ summary: 'Get post comments' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPostComments(
    @Param('uuid', ParseUUIDPipe) postUuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentsResponseDto> {
    /**
     * Get comments for a post
     * @param postUuid - The UUID of the post
     * @param page - The page number
     * @param limit - The number of comments per page
     * @returns Paginated comments
     */

    const result = await this.commentService.getPostComments(
      postUuid,
      page,
      limit,
    );
    return {
      data: this.commentMapper.toCommentDtoList(result.data),
      meta: result.meta,
    };
  }

  @Post('posts/:uuid/comments')
  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createComment(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) postUuid: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    /**
     * Create a new comment
     * @param currentUser - The current user
     * @param postUuid - The UUID of the post
     * @param createCommentDto - The comment data
     * @returns The created comment
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    const comment = await this.commentService.createComment(
      currentUserObj,
      postUuid,
      createCommentDto,
    );
    return { comment: this.commentMapper.toCommentDto(comment) };
  }

  @Patch('comments/:uuid')
  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateComment(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    /**
     * Update a comment
     * @param currentUser - The current user
     * @param uuid - The UUID of the comment
     * @param updateCommentDto - The data to update
     * @returns The updated comment
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    const comment = await this.commentService.updateComment(
      currentUserObj,
      uuid,
      updateCommentDto,
    );
    return { comment: this.commentMapper.toCommentDto(comment) };
  }

  @Delete('comments/:uuid')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteComment(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<{ message: string }> {
    /**
     * Delete a comment
     * @param currentUser - The current user
     * @param uuid - The UUID of the comment
     * @returns Success message
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    await this.commentService.deleteComment(currentUserObj, uuid);
    return { message: 'Comment deleted successfully' };
  }

  @Get('comments/:uuid/replies')
  @ApiOperation({ summary: 'Get comment replies' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCommentReplies(
    @Param('uuid', ParseUUIDPipe) commentUuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentsResponseDto> {
    /**
     * Get replies for a comment
     * @param commentUuid - The UUID of the comment
     * @param page - The page number
     * @param limit - The number of replies per page
     * @returns Paginated replies
     */

    const result = await this.commentService.getCommentReplies(
      commentUuid,
      page,
      limit,
    );
    return {
      data: this.commentMapper.toCommentDtoList(result.data),
      meta: result.meta,
    };
  }
}
