/**
 * User mapper service
 *
 * This service is responsible for mapping the user data to the DTOs.
 */

import { Injectable } from '@nestjs/common';
import { User } from '../../database/entities/user.entity';
import { UserProfileDto, UserPostDto, UserCommentDto } from '../dto/user-response.dto';
import { UserStats, PaginatedPosts, PaginatedComments } from '../interfaces/user.interface';

@Injectable()
export class UserMapperService {
  toUserProfileDto(user: User, stats?: UserStats): UserProfileDto {
    /**
     * Map a user to a user profile DTO
     * @param user - The user
     * @param stats - The user stats
     * @returns The user profile DTO
     */

    return {
      uuid: user.uuid,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: { name: user.role?.name || 'user' },
      stats: stats || { postsCount: 0, commentsCount: 0, followersCount: 0, followingCount: 0 },
      createdAt: user.createdAt.toISOString(),
    };
  }

  toUserPostDto(post: any): UserPostDto {
    /**
     * Map a post to a user post DTO
     * @param post - The post
     * @returns The user post DTO
     */

    return {
      uuid: post.uuid,
      content: post.content,
      author: {
        uuid: post.author.uuid,
        username: post.author.username,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        avatarUrl: post.author.avatarUrl,
      },
      stats: {
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
      },
      createdAt: post.createdAt.toISOString(),
    };
  }

  toUserCommentDto(comment: any): UserCommentDto {
    /**
     * Map a comment to a user comment DTO
     * @param comment - The comment
     * @returns The user comment DTO
     */

    return {
      uuid: comment.uuid,
      content: comment.content,
      post: {
        uuid: comment.post.uuid,
        content: comment.post.content,
        author: {
          uuid: comment.post.author.uuid,
          username: comment.post.author.username,
          firstName: comment.post.author.firstName,
          lastName: comment.post.author.lastName,
          avatarUrl: comment.post.author.avatarUrl,
        },
      },
      stats: {
        likesCount: comment.likesCount || 0,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
