/**
 * User DTOs
 */

import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/database/entities/post.entity';
import { User } from 'src/database/entities/user.entity';
import { Comment } from 'src/database/entities/comment.entity';

export class BaseUserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  uuid: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  username: string;

  @ApiProperty({ description: 'First name', example: 'John', nullable: true })
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', nullable: true })
  lastName?: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://cdn.example.com/avatars/johndoe.jpg',
    nullable: true,
  })
  avatarUrl?: string;
}

export class UserProfileDto extends BaseUserDto {
  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about TypeScript',
    nullable: true,
    maxLength: 500,
  })
  bio?: string;

  @ApiProperty({ description: 'User role information' })
  role: { name: string };

  @ApiProperty({ description: 'User statistics' })
  stats: { postsCount: number; commentsCount: number };

  constructor(user: User) {
    super();
    this.uuid = user.uuid;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatarUrl = user.avatarUrl;
    this.bio = user.bio;
    this.role = { name: user.role?.name };
    this.stats = {
      postsCount: user.posts?.length ?? 0,
      commentsCount: user.comments?.length ?? 0,
    };
  }
}

export class UserPostDto {
  @ApiProperty({ description: 'Post unique identifier', format: 'uuid' })
  uuid: string;

  @ApiProperty({ description: 'Post content', example: 'Hello, fake Twitter!' })
  content: string;

  @ApiProperty({
    description: 'Post author information',
    type: () => BaseUserDto,
  })
  author: BaseUserDto;

  @ApiProperty({ description: 'Post creation date', format: 'date-time' })
  createdAt: string;

  constructor(post: Post) {
    this.uuid = post.uuid;
    this.content = post.content;
    this.author = new BaseUserDto();
    this.author.uuid = post.author?.uuid;
    this.author.username = post.author?.username;
    this.author.firstName = post.author?.firstName;
    this.author.lastName = post.author?.lastName;
    this.author.avatarUrl = post.author?.avatarUrl;
    this.createdAt = post.createdAt?.toISOString?.() ?? '';
  }
}

export class UserCommentDto {
  @ApiProperty({ description: 'Comment unique identifier', format: 'uuid' })
  uuid: string;

  @ApiProperty({ description: 'Comment content', example: 'Great post!' })
  content: string;

  @ApiProperty({ description: 'Post information this comment belongs to' })
  post: UserPostDto;

  @ApiProperty({
    description: 'Comment author information',
    type: () => BaseUserDto,
  })
  author: BaseUserDto;

  @ApiProperty({ description: 'Comment creation date', format: 'date-time' })
  createdAt: string;

  constructor(comment: Comment) {
    this.uuid = comment.uuid;
    this.content = comment.content;
    this.post = new UserPostDto(comment.post);
    this.author = new BaseUserDto();
    this.author.uuid = comment.author?.uuid;
    this.author.username = comment.author?.username;
    this.author.firstName = comment.author?.firstName;
    this.author.lastName = comment.author?.lastName;
    this.author.avatarUrl = comment.author?.avatarUrl;
    this.createdAt = comment.createdAt?.toISOString?.() ?? '';
  }
}

export class UserStatsDto {
  @ApiProperty({ description: 'User posts count' })
  postsCount: number;

  @ApiProperty({ description: 'User comments count' })
  commentsCount: number;

  @ApiProperty({ description: 'User followers count' })
  followersCount: number;

  @ApiProperty({ description: 'User following count' })
  followingCount: number;
}
