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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
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

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully' })
  create(@Body() createBlogDto: CreateBlogDto) {
    this.auditService.recordOperation('blog_create', '/blogs', {
      title: createBlogDto.title,
      authorId: this.requestContext.getUserId(),
    });

    return this.blogsService.create(createBlogDto);
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
  @ApiOperation({ summary: 'Get current user blog posts' })
  @ApiResponse({ status: 200, description: 'List of user blog posts' })
  findMyBlogs() {
    const userId = this.requestContext.getUserId();
    this.auditService.recordAccess('blogs', 'user_blogs');

    return this.blogsService.findByAuthor(userId || '');
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
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    this.auditService.recordOperation('blog_update', id, {
      changes: updateBlogDto,
      authorId: this.requestContext.getUserId(),
    });

    return this.blogsService.update(id, updateBlogDto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post published successfully' })
  publish(@Param('id') id: string) {
    this.auditService.recordOperation('blog_publish', id, {
      authorId: this.requestContext.getUserId(),
    });

    return this.blogsService.publish(id);
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a blog post' })
  @ApiResponse({
    status: 200,
    description: 'Blog post unpublished successfully',
  })
  unpublish(@Param('id') id: string) {
    this.auditService.recordOperation('blog_unpublish', id, {
      authorId: this.requestContext.getUserId(),
    });

    return this.blogsService.unpublish(id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/unlike a blog post' })
  @ApiResponse({ status: 200, description: 'Blog post like status updated' })
  like(@Param('id') id: string) {
    this.auditService.recordOperation('blog_like', id, {
      userId: this.requestContext.getUserId(),
    });

    return this.blogsService.like(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiResponse({ status: 204, description: 'Blog post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  remove(@Param('id') id: string) {
    this.auditService.recordOperation('blog_delete', id, {
      authorId: this.requestContext.getUserId(),
    });

    return this.blogsService.remove(id);
  }
}
