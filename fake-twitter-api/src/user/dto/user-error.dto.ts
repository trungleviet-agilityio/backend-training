/**
 * User error DTOs
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  ForbiddenResponse,
  InternalServerError,
  NotFoundResponse,
  UnauthorizedResponse,
} from '../../common';

export class UserUnauthorizedErrorDto extends UnauthorizedResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized access - Invalid credentials',
  })
  declare message: string;

  constructor(message = 'Unauthorized access - Invalid credentials') {
    super(message);
  }
}

export class UserForbiddenErrorDto extends ForbiddenResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'User is not authorized to access this resource',
  })
  declare message: string;

  constructor(message = 'User is not authorized to access this resource') {
    super(message);
  }
}

export class UserNotFoundErrorDto extends NotFoundResponse {
  @ApiProperty({
    description: 'Error message',
    example: 'User not found or does not exist',
  })
  declare message: string;

  constructor(message = 'User not found or does not exist') {
    super(message);
  }
}

export class UserInternalServerErrorDto extends InternalServerError {
  @ApiProperty({
    description: 'Error message',
    example: 'Internal server error while processing the request',
  })
  declare message: string;

  constructor(message = 'Internal server error while processing the request') {
    super(message);
  }
}
