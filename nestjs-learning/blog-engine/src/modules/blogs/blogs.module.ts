/**
 * Blogs Module
 * Provides blog management functionality including CRUD operations
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { BlogRateLimitMiddleware } from './blogs.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogRateLimitMiddleware],
  exports: [BlogsService],
})
export class BlogsModule {}
