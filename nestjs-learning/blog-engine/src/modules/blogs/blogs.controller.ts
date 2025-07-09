/*
This file is used to define the blogs controller for the blogs module.
*/

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { Blog } from './entities/blog.entity';
import { IBlog, IBlogResponse } from './interfaces';
import { IRequest } from '../../shared/interfaces/request.interface';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: IRequest
  ): Promise<IBlog> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    return this.blogsService.create(createBlogDto, authorId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all published blogs' })
  @ApiResponse({ status: 200, description: 'Return all published blogs' })
  async findAll(@Query('includeDrafts') includeDrafts?: string): Promise<IBlogResponse[]> {
    const includeDraftsBool = includeDrafts === 'true';
    return this.blogsService.findAll(includeDraftsBool);
  }

  @Get('my-blogs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user blogs' })
  @ApiResponse({ status: 200, description: 'Return user blogs' })
  async findMyBlogs(
    @Req() req: IRequest,
    @Query('includeDrafts') includeDrafts?: string
  ): Promise<IBlog[]> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    const includeDraftsBool = includeDrafts === 'true';
    return this.blogsService.findByAuthor(authorId, includeDraftsBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({ status: 200, description: 'Return blog by ID' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async findOne(
    @Param('id') id: string,
    @Query('includeDrafts') includeDrafts?: string
  ): Promise<IBlog> {
    const includeDraftsBool = includeDrafts === 'true';
    const blog = await this.blogsService.findOne(id, includeDraftsBool);
    
    // Increment view count
    await this.blogsService.incrementViewCount(id);
    
    return blog;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog updated successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  async update(
    @Param('id') id: string, 
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: IRequest
  ): Promise<IBlog> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    return this.blogsService.update(id, updateBlogDto, authorId);
  }

  @Post(':id/publish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog published successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  async publish(
    @Param('id') id: string,
    @Req() req: IRequest
  ): Promise<IBlog> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    return this.blogsService.publish(id, authorId);
  }

  @Post(':id/unpublish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unpublish blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog unpublished successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  async unpublish(
    @Param('id') id: string,
    @Req() req: IRequest
  ): Promise<IBlog> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    return this.blogsService.unpublish(id, authorId);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog liked successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async like(@Param('id') id: string): Promise<void> {
    await this.blogsService.incrementLikeCount(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog by ID' })
  @ApiResponse({ status: 204, description: 'Blog deleted successfully' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  async remove(
    @Param('id') id: string,
    @Req() req: IRequest
  ): Promise<void> {
    // TODO: Get authorId from JWT token
    const authorId = req.user?.id || 'temp-author-id';
    return this.blogsService.remove(id, authorId);
  }
}
