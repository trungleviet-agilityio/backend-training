/**
 * This file contains the DTO for logout requests.
 */

import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../common/dto';

export class LogoutResponseDto extends SuccessResponse {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
    type: 'boolean',
  })
  declare success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User logged out successfully',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Logout response data (null for logout)',
    example: null,
    nullable: true,
  })
  declare data: null;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
  })
  declare timestamp: string;

  constructor() {
    super(null, 'User logged out successfully');
  }
}
