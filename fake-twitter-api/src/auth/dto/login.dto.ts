/**
 * This file contains the DTO for user login.
 */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthTokensWithUserDto } from './auth.dto';
import { SuccessResponse } from '../../common/dto';

export class LoginPayloadDto {
  @ApiProperty({
    description: 'User email address or username for authentication',
    example: 'john.doe@example.com',
    type: 'string',
    oneOf: [
      {
        type: 'string',
        format: 'email',
        description: 'Valid email address',
        example: 'john.doe@example.com',
      },
      {
        type: 'string',
        minLength: 3,
        maxLength: 20,
        description: 'Username (3-20 characters)',
        example: 'johndoe',
      },
    ],
  })
  @IsString({ message: 'Email or username must be a string' })
  @IsNotEmpty({ message: 'Email or username is required' })
  email: string;

  @ApiProperty({
    description: 'User password for authentication',
    example: 'SecurePass123!',
    type: 'string',
    format: 'password',
    minLength: 8,
    maxLength: 128,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginResponseDto extends SuccessResponse<AuthTokensWithUserDto> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true,
    type: 'boolean',
  })
  declare success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User logged in successfully',
    type: 'string',
  })
  declare message: string;

  @ApiProperty({
    description: 'Login response data containing tokens and user information',
    type: () => AuthTokensWithUserDto,
  })
  declare data: AuthTokensWithUserDto;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-15T10:30:00.000Z',
    type: 'string',
  })
  declare timestamp: string;

  constructor(data: AuthTokensWithUserDto) {
    super(data, 'User logged in successfully');
  }
}
