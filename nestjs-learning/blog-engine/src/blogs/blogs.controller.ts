/*
Blogs controller is used to define the controller for the blogs.
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { RequestLoggerService } from '../config/config.service';
import { IBlogs } from './blogs.interface';
import { HttpExceptionFilter } from '../commons/exception_filter';
import { ValidationPipe, ParseIntPipe } from '../core/pipes';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import { AuthGuard, RoleGuard, RolesGuard } from '../core/guards';
import { Admin, Author, Public } from '../core/decorators';

/*
BlogsController is a controller that provides the blogs functionality for the application.
*/
@UseGuards(AuthGuard, RoleGuard)
@UseFilters(HttpExceptionFilter)
@UsePipes(ValidationPipe)
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly requestLogger: RequestLoggerService,
  ) {}

  @Get()
  @Public()
  getBlogs(): IBlogs[] {
    this.requestLogger.log("Getting blogs", "BlogsController");
    return this.blogsService.getBlogs();
  }

  @Get(':id')
  @Public()
  getBlogById(@Param('id', ParseIntPipe) id: number): IBlogs {
    this.requestLogger.log("Getting blog by id", "BlogsController");
    return this.blogsService.getBlogById(id.toString());
  }

  @Post()
  @Author()
  createBlog(@Body() createBlogDto: CreateBlogDto, @Request() req: any): IBlogs {
    this.requestLogger.log("Creating blog", "BlogsController");
    // You can access the authenticated user from req.user
    console.log('User creating blog:', req.user);
    return this.blogsService.createBlog(createBlogDto);
  }

  @Put(':id')
  @Author()
  updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @Request() req: any
  ): IBlogs {
    this.requestLogger.log("Updating blog", "BlogsController");
    console.log('User updating blog:', req.user);
    return this.blogsService.updateBlog(id.toString(), updateBlogDto);
  }

  @Delete(':id')
  @Admin()
  deleteBlog(@Param('id', ParseIntPipe) id: number, @Request() req: any): void {
    this.requestLogger.log("Deleting blog", "BlogsController");
    console.log('User deleting blog:', req.user);
    return this.blogsService.deleteBlog(id.toString());
  }
}
