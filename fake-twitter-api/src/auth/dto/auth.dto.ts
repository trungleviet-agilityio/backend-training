/**
 * Auth DTOs for data transfer (not responses)
 */

import { ApiProperty } from '@nestjs/swagger';

export class UserRoleDto {
  @ApiProperty({
    description: 'User role name in the system',
    example: 'user',
    enum: ['user', 'admin', 'moderator'],
    type: 'string',
  })
  name: string;
}

export class UserInfoDto {
  @ApiProperty({
    description: 'Unique user identifier (UUID v4)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  uuid: string;

  @ApiProperty({
    description: 'Unique username chosen by the user',
    example: 'johndoe',
    type: 'string',
    minLength: 3,
    maxLength: 20,
  })
  username: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: 'string',
    required: false,
    nullable: true,
    maxLength: 50,
  })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: 'string',
    required: false,
    nullable: true,
    maxLength: 50,
  })
  lastName?: string;

  @ApiProperty({
    description: 'User role information',
    type: () => UserRoleDto,
  })
  role: UserRoleDto;
}

export class TokenDto {
  @ApiProperty({
    description:
      'JWT access token for API authentication (expires in 15 minutes)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: 'string',
    format: 'jwt',
  })
  access_token: string;

  @ApiProperty({
    description:
      'JWT refresh token for obtaining new access tokens (expires in 7 days)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjkyNTQyMn0.refreshSignature',
    type: 'string',
    format: 'jwt',
  })
  refresh_token: string;
}

export class AuthTokensWithUserDto {
  @ApiProperty({
    description: 'JWT authentication tokens',
    type: () => TokenDto,
  })
  tokens: TokenDto;

  @ApiProperty({
    description: 'Authenticated user information',
    type: () => UserInfoDto,
  })
  user: UserInfoDto;
}

export class AuthRefreshTokenDto {
  @ApiProperty({
    description: 'New JWT access token for API authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.NewAccessTokenSignature',
    type: 'string',
    format: 'jwt',
  })
  access_token: string;

  @ApiProperty({
    description: 'New JWT refresh token (old one is invalidated)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjkyNTQyMn0.NewRefreshTokenSignature',
    type: 'string',
    format: 'jwt',
  })
  refresh_token: string;
}
