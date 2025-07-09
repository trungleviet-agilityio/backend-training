/*
Blogs service is used to define the service for the blogs.
*/

import { Injectable } from '@nestjs/common';
import { IBlogs, IBlogsRequest, IBlogsResponse } from './blogs.interface';
import { v4 as uuidv4 } from 'uuid';

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
    createBlog(blog: IBlogsRequest): IBlogs {
        const newBlog: IBlogs = { ...blog, id: uuidv4(), createdAt: new Date(), updatedAt: new Date() };
        this.blogs.push(newBlog);
        return newBlog;
    }

    /*
    updateBlog is a method that updates a blog.
    */
    updateBlog(id: string, blog: IBlogsRequest): IBlogs {
        const index = this.blogs.findIndex((blog) => blog.id === id);
        if (index === -1) {
            throw new Error('Blog not found');
        }
        this.blogs[index] = { ...this.blogs[index], ...blog, updatedAt: new Date() };
        return this.blogs[index];
    }

    /*
    deleteBlog is a method that deletes a blog.
    */
    deleteBlog(id: string): void {
        this.blogs = this.blogs.filter((blog) => blog.id !== id);
    }

    /*
    getBlogById is a method that returns a blog by id.
    */
    getBlogById(id: string): IBlogs {
        const blog = this.blogs.find((blog) => blog.id === id);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return blog;
    }
}
