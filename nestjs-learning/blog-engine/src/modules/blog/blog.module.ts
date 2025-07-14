/**
 * Blogs Module
 * Provides blog management functionality including CRUD operations
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blog.controller';
import { BlogsService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { BlogRateLimitMiddleware } from './blog.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogRateLimitMiddleware],
  exports: [BlogsService],
})
export class BlogsModule {}
