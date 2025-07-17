/**
 * Post controller
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
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PostMapperService, PostService } from './services';
import {
  CreatePostDto,
  PostResponseDto,
  PostsResponseDto,
  UpdatePostDto,
} from './dto';

@ApiTags('Posts')
@Controller('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PostController {
  /**
   * Constructor
   * @param postService - The service for the post
   * @param postMapper - The mapper for the post
   */

  constructor(
    private readonly postService: PostService,
    private readonly postMapper: PostMapperService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<PostsResponseDto> {
    /**
     * Get all published posts with pagination
     * @param page - The page number
     * @param limit - The number of posts per page
     * @returns Paginated posts
     */

    const result = await this.postService.getAllPosts(page, limit);
    return {
      data: this.postMapper.toPostDtoList(result.data),
      meta: result.meta,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPost(
    @CurrentUser() currentUser: JwtPayload,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    /**
     * Create a new post
     * @param currentUser - The current user
     * @param createPostDto - The post data
     * @returns The created post
     */

    console.log('currentUser from decorator:', currentUser);
    console.log('currentUser.sub:', currentUser?.sub);
    console.log('currentUser.role:', currentUser?.role);

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    console.log('currentUserObj:', currentUserObj);

    const post = await this.postService.createPost(
      currentUserObj,
      createPostDto,
    );
    return { post: this.postMapper.toPostDto(post) };
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get single post' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getPost(
    @CurrentUser() currentUser: JwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PostResponseDto> {
    /**
     * Get a single post
     * @param currentUser - The current user
     * @param uuid - The UUID of the post
     * @returns The post
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    const post = await this.postService.findById(uuid, currentUserObj);
    return { post: this.postMapper.toPostDto(post) };
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updatePost(
    @CurrentUser() currentUser: JwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    /**
     * Update a post
     * @param currentUser - The current user
     * @param uuid - The UUID of the post
     * @param updatePostDto - The data to update
     * @returns The updated post
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    const post = await this.postService.updatePost(
      currentUserObj,
      uuid,
      updatePostDto,
    );
    return { post: this.postMapper.toPostDto(post) };
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deletePost(
    @CurrentUser() currentUser: JwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<{ message: string }> {
    /**
     * Delete a post
     * @param currentUser - The current user
     * @param uuid - The UUID of the post
     * @returns Success message
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    await this.postService.deletePost(currentUserObj, uuid);
    return { message: 'Post deleted successfully' };
  }
}
