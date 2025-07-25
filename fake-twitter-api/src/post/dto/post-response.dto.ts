/**
 * Post Response DTOs
 */

import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto';

export class PostAuthorDto {
  @ApiProperty({
    description: 'Author UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  uuid: string;

  @ApiProperty({
    description: 'Author username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Author first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Author last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Author avatar URL',
    example: 'https://cdn.example.com/avatar.jpg',
    required: false,
  })
  avatarUrl?: string;
}

export class PostStatsDto {
  @ApiProperty({
    description: 'Number of likes',
    example: 10,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Number of comments',
    example: 5,
  })
  commentsCount: number;
}

export class PostDto {
  @ApiProperty({
    description: 'Post UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;

  @ApiProperty({
    description: 'Post content',
    example: 'Hello, fake Twitter!',
  })
  content: string;

  @ApiProperty({
    description: 'Post author',
    type: PostAuthorDto,
  })
  author: PostAuthorDto;

  @ApiProperty({
    description: 'Post statistics',
    type: PostStatsDto,
  })
  stats: PostStatsDto;

  @ApiProperty({
    description: 'Whether the post is published',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Post creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Post update date',
    example: '2024-01-15T11:30:00Z',
    required: false,
  })
  updatedAt?: Date;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Post data',
    type: PostDto,
  })
  post: PostDto;
}

export class PostsResponseDto {
  @ApiProperty({
    description: 'List of posts',
    type: [PostDto],
  })
  items: PostDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationDto,
  })
  meta: PaginationDto;
}
