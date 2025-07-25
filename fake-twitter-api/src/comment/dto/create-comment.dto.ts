/**
 * This file contains the DTO for creating a comment.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'Great post! This is really insightful.',
    maxLength: 280,
    minLength: 1,
    type: String,
  })
  @IsNotEmpty({ message: 'Comment content is required' })
  @IsString({ message: 'Comment content must be a string' })
  @MaxLength(280, { message: 'Comment content cannot exceed 280 characters' })
  content: string;

  @ApiPropertyOptional({
    description: 'UUID of the parent comment for replies',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Parent UUID must be a valid UUID' })
  parent_uuid?: string | null;
}
