/**
 * This file contains the DTO for user registration.
 */

import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'john.doe@example.com',
    format: 'email',
    type: 'string',
    uniqueItems: true,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Unique username for the account',
    example: 'johndoe',
    type: 'string',
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
    uniqueItems: true,
  })
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  username: string;

  @ApiProperty({
    description: 'Strong password for account security',
    example: 'SecurePass123!',
    type: 'string',
    format: 'password',
    minLength: 8,
    maxLength: 128,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'User first name (optional)',
    example: 'John',
    type: 'string',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'First name must not exceed 50 characters' })
  firstName?: string;

  @ApiProperty({
    description: 'User last name (optional)',
    example: 'Doe',
    type: 'string',
    required: false,
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  @MaxLength(50, { message: 'Last name must not exceed 50 characters' })
  lastName?: string;
}
