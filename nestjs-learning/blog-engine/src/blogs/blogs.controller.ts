/*
Blogs controller is used to define the controller for the blogs.
*/

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { RequestLoggerService } from '../config/config.service';
import { IBlogsRequest } from './blogs.interface';

/*
BlogsController is a controller that provides the blogs functionality for the application.
*/
@Controller('blogs')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly requestLogger: RequestLoggerService,
    ) {}  // This is used to inject the blogs service into the blogs controller

    @Get()
    getBlogs() {
        this.requestLogger.log("Getting blogs", "BlogsController");
        return this.blogsService.getBlogs();
    }

    @Get(':id')
    getBlogById(@Param('id') id: string) {
        this.requestLogger.log("Getting blog by id", "BlogsController");
        return this.blogsService.getBlogById(id);
    }

    @Post()
    createBlog(@Body() blog: IBlogsRequest) {
        this.requestLogger.log("Creating blog", "BlogsController");
        return this.blogsService.createBlog(blog);
    }

    @Put(':id')
    updateBlog(@Param('id') id: string, @Body() blog: IBlogsRequest) {
        this.requestLogger.log("Updating blog", "BlogsController");
        return this.blogsService.updateBlog(id, blog);
    }

    @Delete(':id')
    deleteBlog(@Param('id') id: string) {
        this.requestLogger.log("Deleting blog", "BlogsController");
        return this.blogsService.deleteBlog(id);
    }

}
