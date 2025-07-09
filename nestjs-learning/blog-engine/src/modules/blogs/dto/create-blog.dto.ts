/*
Create blog DTO is used to define the DTO for creating blogs.
*/

import { IsString, IsOptional, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ description: 'Blog title', example: 'My First Blog Post' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Blog content', example: 'This is the content of my blog post...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({ description: 'Blog excerpt', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({ description: 'Cover image URL', required: false })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ description: 'Blog tags', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
