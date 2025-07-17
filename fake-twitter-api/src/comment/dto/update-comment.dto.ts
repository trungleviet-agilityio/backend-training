/**
 * This file contains the DTO for updating a comment.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content',
    example: 'Updated comment!',
    maxLength: 280,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  content: string;
}
