/**
 * This file contains the DTO for refresh token requests.
 */

import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthRefreshTokenDto } from './auth.dto';
import { SuccessResponse } from '../../common/dto';

export class RefreshTokenPayloadDto {
  @ApiProperty({
    description:
      'Valid JWT refresh token used to generate new access and refresh tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjMyNTQyMn0.signature',
    format: 'jwt',
    minLength: 10,
    pattern: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$',
  })
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsJWT({ message: 'Refresh token must be a valid JWT format' })
  refreshToken: string;
}

export class RefreshTokenResponseDto extends SuccessResponse<AuthRefreshTokenDto> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
    type: 'boolean',
  })
  declare success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Token refreshed successfully',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Refresh token response data containing new tokens',
    type: () => AuthRefreshTokenDto,
  })
  declare data: AuthRefreshTokenDto;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
  })
  declare timestamp: string;

  constructor(data: AuthRefreshTokenDto) {
    super(data, 'Token refreshed successfully');
  }
}
