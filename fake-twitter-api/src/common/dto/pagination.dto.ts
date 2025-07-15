/**
 * Pagination DTOs following NestJS patterns
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total items', example: 100 })
  total: number;

  @ApiProperty({ description: 'Total pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPrev: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Items array', isArray: true })
  items: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  meta: PaginationMetaDto;
}
