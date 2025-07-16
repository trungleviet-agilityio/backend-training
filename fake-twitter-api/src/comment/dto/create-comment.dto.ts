/**
 * This file contains the DTO for creating a comment.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content', example: 'Great post!', maxLength: 280 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  content: string;

  @ApiProperty({ description: 'Parent comment UUID (for replies)', example: null, required: false })
  @IsOptional()
  @IsUUID()
  parent_uuid?: string | null;
}
