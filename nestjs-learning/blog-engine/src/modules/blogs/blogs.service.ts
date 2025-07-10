/**
 * Blogs Service
 * Provides business logic for blog-related operations
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CustomLoggerService } from '../../core/logger/custom-logger.service';

interface ICreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  authorId?: string;
}

interface IBlogFilters {
  page?: number;
  limit?: number;
  includeDrafts?: boolean;
  search?: string;
}

@Injectable()
export class BlogsService {
  private readonly logger: CustomLoggerService;

  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    logger: CustomLoggerService,
  ) {
    this.logger = logger;
    this.logger.setContext('BlogsService');
  }

  async create(createBlogData: ICreateBlogData): Promise<Blog> {
    const blog = this.blogRepository.create({
      title: createBlogData.title,
      content: createBlogData.content,
      excerpt: createBlogData.excerpt,
      authorId: createBlogData.authorId || 'temp-author-id',
      tags: createBlogData.tags || [],
      isPublished: false,
      viewCount: 0,
      likeCount: 0,
    });

    return this.blogRepository.save(blog);
  }

  async findAll(filters: IBlogFilters = {}): Promise<Blog[]> {
    const { page = 1, limit = 10, includeDrafts = false } = filters;

    const queryBuilder = this.blogRepository.createQueryBuilder('blog');

    if (!includeDrafts) {
      queryBuilder.where('blog.isPublished = :isPublished', {
        isPublished: true,
      });
    }

    return queryBuilder
      .orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findByAuthor(authorId: string, includeDrafts = true): Promise<Blog[]> {
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.authorId = :authorId', { authorId });

    if (!includeDrafts) {
      queryBuilder.andWhere('blog.isPublished = :isPublished', {
        isPublished: true,
      });
    }

    return queryBuilder.orderBy('blog.createdAt', 'DESC').getMany();
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);

    Object.assign(blog, updateBlogDto);

    try {
      return await this.blogRepository.save(blog);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to update blog:', errorMessage);
      throw error;
    }
  }

  async publish(id: string): Promise<Blog> {
    const blog = await this.findOne(id);

    blog.publish(); // Use the entity method

    return this.blogRepository.save(blog);
  }

  async unpublish(id: string): Promise<Blog> {
    const blog = await this.findOne(id);

    blog.unpublish(); // Use the entity method

    return this.blogRepository.save(blog);
  }

  async like(id: string): Promise<Blog> {
    const blog = await this.findOne(id);

    blog.likeCount = (blog.likeCount || 0) + 1;

    return this.blogRepository.save(blog);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.blogRepository.increment({ id }, 'viewCount', 1);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
  }
}
