/**
 * Update Post DTO
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post content',
    example: 'Updated post content!',
    type: 'string',
    required: false,
    maxLength: 280,
  })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @MaxLength(280, { message: 'Content must not exceed 280 characters' })
  content?: string;

  @ApiProperty({
    description: 'Whether the post is published',
    example: true,
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublished must be a boolean' })
  isPublished?: boolean;
}
