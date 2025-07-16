/**
 * Post mapper service
 */

import { Injectable } from '@nestjs/common';
import { Post } from '../../database/entities/post.entity';
import { PostDto, PostAuthorDto, PostStatsDto } from '../dto';

@Injectable()
export class PostMapperService {
  toPostDto(post: Post): PostDto {
    /**
     * Map a post to a PostDto
     * @param post - The post to map
     * @returns The PostDto
     */

    const author: PostAuthorDto = {
      uuid: post.author.uuid,
      username: post.author.username,
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
      avatarUrl: post.author.avatarUrl,
    };

    const stats: PostStatsDto = {
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    };

    return {
      uuid: post.uuid,
      content: post.content,
      author,
      stats,
      isPublished: post.isPublished,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  toPostDtoList(posts: Post[]): PostDto[] {
    /**
     * Map a list of posts to a list of PostDto
     * @param posts - The list of posts to map
     * @returns The list of PostDto
     */

    return posts.map(post => this.toPostDto(post));
  }
}
