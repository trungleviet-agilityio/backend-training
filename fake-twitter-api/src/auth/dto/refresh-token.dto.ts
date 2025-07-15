/**
 * This file contains the DTO for refresh token requests.
 */

import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description:
      'Valid JWT refresh token used to generate new access and refresh tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjMyNTQyMn0.signature',
    type: 'string',
    format: 'jwt',
    minLength: 10,
    pattern: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]*$',
  })
  @IsString({ message: 'Refresh token must be a string' })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsJWT({ message: 'Refresh token must be a valid JWT format' })
  refreshToken: string;
}
