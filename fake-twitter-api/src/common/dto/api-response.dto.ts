/**
 * Common API response formats for the entire application
 */

import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

// Generic type constraint for response data
export type ResponseData =
  | Record<string, unknown>
  | string
  | number
  | boolean
  | null
  | Array<unknown>
  | object;

export interface IApiResponse<T = ResponseData> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
  path?: string;
}

export class BaseApiResponse<T = ResponseData> implements IApiResponse<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    required: false,
  })
  path?: string;

  @ApiProperty({
    description: 'Response data payload',
  })
  data?: T;

  @ApiProperty({
    description: 'Error details if any',
    example: [],
    required: false,
  })
  errors?: string[];

  constructor(partial: Partial<BaseApiResponse<T>>) {
    Object.assign(this, partial);
    this.timestamp = this.timestamp || new Date().toISOString();
  }
}

export class SuccessResponse<T = ResponseData> extends BaseApiResponse<T> {
  @ApiProperty({ example: true })
  declare success: boolean;

  constructor(data: T, message = 'Success') {
    super({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

export class ErrorResponse extends BaseApiResponse<null> {
  @ApiProperty({ example: false })
  declare success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error details',
  })
  declare errors: string[];

  constructor(
    message: string,
    errors: string[] = [],
    statusCode = 400,
    path?: string,
  ) {
    super({
      success: false,
      message,
      data: null,
      errors,
      timestamp: new Date().toISOString(),
      path,
    });
    this.statusCode = statusCode;
  }
}

// Pagination Metadata
export class PaginationMeta {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Has previous page',
    example: false,
  })
  hasPrev: boolean;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}

export class PaginatedData<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta,
  })
  meta: PaginationMeta;

  constructor(items: T[], meta: PaginationMeta) {
    this.items = items;
    this.meta = meta;
  }
}

export class PaginatedResponse<T> extends SuccessResponse<PaginatedData<T>> {
  constructor(
    items: T[],
    meta: PaginationMeta,
    message = 'Data retrieved successfully',
  ) {
    super(new PaginatedData(items, meta), message);
  }
}

export class CollectionResponse<T> extends SuccessResponse<T[]> {
  @ApiProperty({
    description: 'Total number of items',
    example: 5,
  })
  count: number;

  constructor(items: T[], message = 'Data retrieved successfully') {
    super(items, message);
    this.count = items.length;
  }
}

export class MessageResponse extends BaseApiResponse<null> {
  constructor(message: string, success = true) {
    super({
      success,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}

export class CreatedResponse<T> extends SuccessResponse<T> {
  constructor(data: T, message = 'Resource created successfully') {
    super(data, message);
  }
}

export class UpdatedResponse<T> extends SuccessResponse<T> {
  constructor(data: T, message = 'Resource updated successfully') {
    super(data, message);
  }
}

export class DeletedResponse extends MessageResponse {
  constructor(message = 'Resource deleted successfully') {
    super(message, true);
  }
}

export class NotFoundResponse extends ErrorResponse {
  constructor(resource = 'Resource', id?: string | number) {
    const message = id
      ? `${resource} with ID '${id}' not found`
      : `${resource} not found`;
    super(message, [], 404);
  }
}

export class UnauthorizedResponse extends ErrorResponse {
  constructor(message = 'Unauthorized access') {
    super(message, [], 401);
  }
}

export class ForbiddenResponse extends ErrorResponse {
  constructor(message = 'Access forbidden') {
    super(message, [], 403);
  }
}

export class ValidationErrorResponse extends ErrorResponse {
  constructor(errors: string[]) {
    super('Validation failed', errors, 422);
  }
}

export class ConflictResponse extends ErrorResponse {
  constructor(message = 'Resource already exists') {
    super(message, [], 409);
  }
}
