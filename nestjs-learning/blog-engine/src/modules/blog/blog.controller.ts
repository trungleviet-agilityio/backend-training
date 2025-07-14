/**
 * Blogs Controller
 * Handles all blog-related HTTP requests including CRUD operations,
 * publishing, and engagement features
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { CurrentUser, Roles } from '../auth/decorators';
import { RequestContextService } from '../../commons/context/services/request-context.service';
import { AuditService } from '../../commons/context/services/audit.service';
import { UserSpecificCacheService } from '../../commons/context/services/user-cache.service';
import { CustomLoggerService } from '../../core/logger/custom-logger.service';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly blogsService: BlogsService,
    private readonly requestContext: RequestContextService,
    private readonly auditService: AuditService,
    private readonly userCache: UserSpecificCacheService,
    logger: CustomLoggerService,
  ) {
    this.logger = logger;
    this.logger.setContext('BlogsController');

    this.logger.debug('📖 Blogs controller initialized', {
      requestId: this.requestContext.getRequestId(),
      component: 'BLOGS_CONTROLLER',
      action: 'INITIALIZE',
    });
  }

  /**
   * Check if user owns the blog or is admin
   */
  private async checkBlogOwnership(blogId: string, user: any): Promise<void> {
    // Admin users can modify any blog
    if (user.role === 'admin') {
      return;
    }

    // Get the blog to check ownership
    const blog = await this.blogsService.findOne(blogId);
    if (blog.authorId !== user.id) {
      throw new ForbiddenException('You can only modify your own blog posts');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: any) {
    this.auditService.recordOperation('blog_create', '/blogs', {
      title: createBlogDto.title,
      authorId: user.id,
    });

    return this.blogsService.create({ ...createBlogDto, authorId: user.id });
  }

  @Get()
  @ApiOperation({ summary: 'Get all published blog posts' })
  @ApiResponse({ status: 200, description: 'List of published blog posts' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    this.auditService.recordAccess('blogs', 'list');

    return this.blogsService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('my-blogs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user blog posts' })
  @ApiResponse({ status: 200, description: 'List of user blog posts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyBlogs(@CurrentUser() user: any) {
    this.auditService.recordAccess('blogs', 'user_blogs');

    return this.blogsService.findByAuthor(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiResponse({ status: 200, description: 'Blog post details' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  findOne(@Param('id') id: string) {
    this.auditService.recordAccess('blog', id);

    // Increment view count in background
    this.blogsService.incrementViewCount(id).catch((error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('📖 Failed to increment view count:', {
        requestId: this.requestContext.getRequestId(),
        component: 'BLOGS_CONTROLLER',
        action: 'INCREMENT_VIEW_ERROR',
        metadata: { blogId: id, error: errorMessage },
      });
    });

    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto, @CurrentUser() user: any) {
    // Check if user owns the blog or is admin
    await this.checkBlogOwnership(id, user);

    this.auditService.recordOperation('blog_update', id, {
      changes: updateBlogDto,
      authorId: user.id,
    });

    return this.blogsService.update(id, updateBlogDto);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post published successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  async publish(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if user owns the blog or is admin
    await this.checkBlogOwnership(id, user);

    this.auditService.recordOperation('blog_publish', id, {
      authorId: user.id,
    });

    return this.blogsService.publish(id);
  }

  @Post(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish a blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post unpublished successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  async unpublish(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if user owns the blog or is admin
    await this.checkBlogOwnership(id, user);

    this.auditService.recordOperation('blog_unpublish', id, {
      authorId: user.id,
    });

    return this.blogsService.unpublish(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/unlike a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post like status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  like(@Param('id') id: string, @CurrentUser() user: any) {
    this.auditService.recordOperation('blog_like', id, {
      userId: user.id,
    });

    return this.blogsService.like(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the author' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    // Check if user owns the blog or is admin
    await this.checkBlogOwnership(id, user);

    this.auditService.recordOperation('blog_delete', id, {
      authorId: user.id,
    });

    return this.blogsService.remove(id);
  }
}
