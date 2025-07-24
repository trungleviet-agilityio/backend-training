/**
 * This file contains the DTO for password reset requests.
 */

import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '../../common/dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordPayloadDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    minLength: 32,
    maxLength: 64,
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password for the account',
    example: 'NewSecurePass123!',
    format: 'password',
    minLength: 8,
    maxLength: 128,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordResponseDto extends SuccessResponse {
  constructor() {
    super(null, 'Password reset successfully');
  }
}
