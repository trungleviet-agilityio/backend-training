/*
Blogs service is used to define the service for the blogs.
*/

import { Injectable } from '@nestjs/common';
import { IBlogs } from './blogs.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateBlogDto, UpdateBlogDto } from './dto';
import {
  BlogCreationException,
  BlogDeletionException,
  BlogNotFoundException,
  BlogUpdateException,
  FieldLengthException,
  MissingRequiredFieldException,
} from '../core/exceptions';

/*
BlogsService is a service that provides the blogs functionality for the application.
*/
@Injectable()
export class BlogsService {
  private blogs: IBlogs[] = [];

  /*
  getBlogs is a method that returns the blogs.
  */
  getBlogs(): IBlogs[] {
    return this.blogs;
  }

  /*
  createBlog is a method that creates a new blog.
  */
  createBlog(blog: CreateBlogDto): IBlogs {
    try {
      // Validate input
      if (!blog.title || blog.title.trim() === '') {
        throw new MissingRequiredFieldException('Blog title is required');
      }

      if (!blog.content || blog.content.trim() === '') {
        throw new MissingRequiredFieldException('Blog content is required');
      }

      if (blog.title.length > 100) {
        throw new FieldLengthException('Blog title', 100, blog.title.length);
      }

      const newBlog: IBlogs = {
        id: uuidv4(),
        title: blog.title.trim(),
        content: blog.content.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.blogs.push(newBlog);
      return newBlog;
    } catch (error) {
      if (error instanceof MissingRequiredFieldException || error instanceof FieldLengthException) {
        throw error;
      }
      throw new BlogCreationException(error.message);
    }
  }

  /*
  updateBlog is a method that updates a blog.
  */
  updateBlog(id: string, blog: UpdateBlogDto): IBlogs {
    try {
      const index = this.blogs.findIndex((blog) => blog.id === id);
      if (index === -1) {
        throw new BlogNotFoundException(id);
      }

      const updatedBlog: IBlogs = { ...this.blogs[index] };

      // Validate and update title
      if (blog.title !== undefined) {
        if (blog.title.trim() === '') {
          throw new MissingRequiredFieldException('Blog title cannot be empty');
        }
        if (blog.title.length > 100) {
          throw new FieldLengthException('Blog title', 100, blog.title.length);
        }
        updatedBlog.title = blog.title.trim();
      }

      // Validate and update content
      if (blog.content !== undefined) {
        if (blog.content.trim() === '') {
          throw new MissingRequiredFieldException('Blog content cannot be empty');
        }
        updatedBlog.content = blog.content.trim();
      }

      updatedBlog.updatedAt = new Date();

      this.blogs[index] = updatedBlog;
      return this.blogs[index];
    } catch (error) {
      if (error instanceof BlogNotFoundException || error instanceof MissingRequiredFieldException || error instanceof FieldLengthException) {
        throw error;
      }
      throw new BlogUpdateException(id, error.message);
    }
  }

  /*
  getBlogById is a method that returns a blog by id.
  */
  getBlogById(id: string): IBlogs {
    const blog = this.blogs.find((blog) => blog.id === id);
    if (!blog) {
      throw new BlogNotFoundException(id);
    }
    return blog;
  }

  /*
  deleteBlog is a method that deletes a blog.
  */
  deleteBlog(id: string): void {
    try {
      const index = this.blogs.findIndex((blog) => blog.id === id);
      if (index === -1) {
        throw new BlogNotFoundException(id);
      }

      this.blogs = this.blogs.filter((blog) => blog.id !== id);
    } catch (error) {
      if (error instanceof BlogNotFoundException) {
        throw error;
      }
      throw new BlogDeletionException(id, error.message);
    }
  }
}
