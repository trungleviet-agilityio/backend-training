/*
This file is used to define the blogs service for the blogs module.
*/

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IBlog, ICreateBlog, IUpdateBlog, IBlogResponse, IBlogFilters } from './interfaces';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private blogsRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto, authorId: string): Promise<IBlog> {
    const blog = this.blogsRepository.create({
      ...createBlogDto,
      authorId,
    });
    const savedBlog = await this.blogsRepository.save(blog);
    return savedBlog as IBlog;
  }

  async findAll(includeDrafts = false): Promise<IBlogResponse[]> {
    const query = this.blogsRepository.createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .select(['blog', 'author.id', 'author.firstName', 'author.lastName']);

    if (!includeDrafts) {
      query.where('blog.isPublished = :isPublished', { isPublished: true });
    }

    const blogs = await query.getMany();
    
    return blogs.map(blog => ({
      ...blog,
      isPublic: blog.isPublic
    }));
  }

  async findOne(id: string, includeDrafts = false): Promise<IBlog> {
    const query = this.blogsRepository.createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .where('blog.id = :id', { id });

    if (!includeDrafts) {
      query.andWhere('blog.isPublished = :isPublished', { isPublished: true });
    }

    const blog = await query.getOne();
    
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    
    return blog as IBlog;
  }

  async findByAuthor(authorId: string, includeDrafts = false): Promise<IBlog[]> {
    const query = this.blogsRepository.createQueryBuilder('blog')
      .where('blog.authorId = :authorId', { authorId });

    if (!includeDrafts) {
      query.andWhere('blog.isPublished = :isPublished', { isPublished: true });
    }

    const blogs = await query.getMany();
    return blogs as IBlog[];
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, authorId: string): Promise<IBlog> {
    const blog = await this.findOne(id, true) as Blog;
    
    if (blog.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own blogs');
    }
    
    Object.assign(blog, updateBlogDto);
    const savedBlog = await this.blogsRepository.save(blog);
    return savedBlog as IBlog;
  }

  async publish(id: string, authorId: string): Promise<IBlog> {
    const blog = await this.findOne(id, true) as Blog;
    
    if (blog.authorId !== authorId) {
      throw new ForbiddenException('You can only publish your own blogs');
    }
    
    blog.publish();
    const savedBlog = await this.blogsRepository.save(blog);
    return savedBlog as IBlog;
  }

  async unpublish(id: string, authorId: string): Promise<IBlog> {
    const blog = await this.findOne(id, true) as Blog;
    
    if (blog.authorId !== authorId) {
      throw new ForbiddenException('You can only unpublish your own blogs');
    }
    
    blog.unpublish();
    const savedBlog = await this.blogsRepository.save(blog);
    return savedBlog as IBlog;
  }

  async remove(id: string, authorId: string): Promise<void> {
    const blog = await this.findOne(id, true) as Blog;
    
    if (blog.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own blogs');
    }
    
    await this.blogsRepository.remove(blog);
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.blogsRepository.increment({ id }, 'viewCount', 1);
  }

  async incrementLikeCount(id: string): Promise<void> {
    await this.blogsRepository.increment({ id }, 'likeCount', 1);
  }
}
