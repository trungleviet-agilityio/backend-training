/**
 * Create Post DTO
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post content',
    example: 'Hello, fake Twitter! This is my first post.',
    type: 'string',
    required: true,
    maxLength: 280,
  })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MaxLength(280, { message: 'Content must not exceed 280 characters' })
  content: string;

  @ApiProperty({
    description: 'Whether the post is published',
    example: true,
    type: 'boolean',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished?: boolean;
}
