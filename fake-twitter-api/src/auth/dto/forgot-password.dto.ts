/**
 * This file contains the DTO for forgot password requests.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MessageResponse } from '../../common/dto';

export class ForgotPasswordPayloadDto {
  @ApiProperty({
    description: 'Email address of the account to reset password for',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ForgotPasswordResponseDto extends MessageResponse {
  constructor() {
    super(
      'If an account with this email exists, a password reset link has been sent.',
      true,
    );
  }
}
