/**
 * This file contains the DTO for user login.
 */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
