/**
 * Comment Response DTOs
 */

import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto';

export class CommentAuthorDto {
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

export class CommentStatsDto {
  @ApiProperty({
    description: 'Number of likes',
    example: 3,
  })
  likesCount: number;
}

export class CommentDto {
  @ApiProperty({
    description: 'Comment UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uuid: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great post!',
  })
  content: string;

  @ApiProperty({
    description: 'Comment author',
    type: CommentAuthorDto,
  })
  author: CommentAuthorDto;

  @ApiProperty({
    description: 'Comment statistics',
    type: CommentStatsDto,
  })
  stats: CommentStatsDto;

  @ApiProperty({
    description: 'Comment depth level',
    example: 0,
  })
  depthLevel: number;

  @ApiProperty({
    description: 'Parent comment UUID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false,
  })
  parentUuid?: string;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment update date',
    example: '2024-01-15T11:30:00Z',
    required: false,
  })
  updatedAt?: Date;
}

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment data',
    type: CommentDto,
  })
  comment: CommentDto;
}

export class CommentsResponseDto {
  @ApiProperty({
    description: 'List of comments',
    type: [CommentDto],
  })
  items: CommentDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationDto,
  })
  meta: PaginationDto;
}
