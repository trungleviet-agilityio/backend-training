/**
 * User Response DTOs
 */

import { ApiProperty } from '@nestjs/swagger';
import { PaginatedData, PaginationMeta } from '../../common';

// Base User Info DTO
export class BaseUserDto {
  @ApiProperty({
    description: 'Unique user identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  uuid: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    nullable: true,
  })
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    nullable: true,
  })
  lastName?: string;

  @ApiProperty({
    description: 'Avatar URL',
    example: 'https://cdn.example.com/avatars/johndoe.jpg',
    nullable: true,
  })
  avatarUrl?: string;
}

// Extended User Profile DTO
export class UserProfileDto extends BaseUserDto {
  @ApiProperty({
    description: 'User bio',
    example: 'Software developer passionate about TypeScript',
    nullable: true,
  })
  bio?: string;

  @ApiProperty({
    description: 'User role information',
  })
  role: {
    name: string;
  };

  @ApiProperty({
    description: 'User statistics',
  })
  stats: {
    postsCount: number;
    commentsCount: number;
  };

  @ApiProperty({
    description: 'Account creation date',
    format: 'date-time',
  })
  createdAt: string;
}

// User Post DTO (for user's posts endpoint)
export class UserPostDto {
  @ApiProperty({
    description: 'Post unique identifier',
    format: 'uuid',
  })
  uuid: string;

  @ApiProperty({
    description: 'Post content',
    example: 'Hello, fake Twitter!',
  })
  content: string;

  @ApiProperty({
    description: 'Post author information',
  })
  author: BaseUserDto;

  @ApiProperty({
    description: 'Post statistics',
  })
  stats: {
    likesCount: number;
    commentsCount: number;
  };

  @ApiProperty({
    description: 'Post creation date',
    format: 'date-time',
  })
  createdAt: string;
}

// User Comment DTO (for user's comments endpoint)
export class UserCommentDto {
  @ApiProperty({
    description: 'Comment unique identifier',
    format: 'uuid',
  })
  uuid: string;

  @ApiProperty({
    description: 'Comment content',
    example: 'Great post!',
  })
  content: string;

  @ApiProperty({
    description: 'Post information this comment belongs to',
  })
  post: {
    uuid: string;
    content: string;
    author: BaseUserDto;
  };

  @ApiProperty({
    description: 'Comment statistics',
  })
  stats: {
    likesCount: number;
  };

  @ApiProperty({
    description: 'Comment creation date',
    format: 'date-time',
  })
  createdAt: string;
}

/**
 * Builder Pattern Implementation for User Response Construction
 * This class demonstrates the Builder pattern for creating complex user responses
 */
export class UserResponseBuilder {
  private user: Partial<UserProfileDto> = {};
  private includeStats = false;
  private includeRole = false;

  static create(): UserResponseBuilder {
    return new UserResponseBuilder();
  }

  withBasicInfo(uuid: string, username: string, firstName?: string, lastName?: string): this {
    this.user.uuid = uuid;
    this.user.username = username;
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    return this;
  }

  withProfileDetails(bio?: string, avatarUrl?: string): this {
    this.user.bio = bio;
    this.user.avatarUrl = avatarUrl;
    return this;
  }

  withRole(roleName: string): this {
    this.user.role = { name: roleName };
    this.includeRole = true;
    return this;
  }

  withStats(postsCount: number, commentsCount: number): this {
    this.user.stats = { postsCount, commentsCount };
    this.includeStats = true;
    return this;
  }

  withTimestamps(createdAt: Date): this {
    this.user.createdAt = createdAt.toISOString();
    return this;
  }

  build(): UserProfileDto {
    if (!this.user.uuid || !this.user.username) {
      throw new Error('User must have uuid and username');
    }

    return {
      uuid: this.user.uuid,
      username: this.user.username,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      bio: this.user.bio,
      avatarUrl: this.user.avatarUrl,
      role: this.user.role || { name: 'user' },
      stats: this.user.stats || { postsCount: 0, commentsCount: 0 },
      createdAt: this.user.createdAt || new Date().toISOString(),
    };
  }
}

// Response wrapper DTOs
export class UserProfileResponseDto {
  @ApiProperty({ description: 'User profile data' })
  user: UserProfileDto;
}

export class UserPostsResponseDto {
  @ApiProperty({
    description: 'User posts data',
    type: PaginatedData<UserPostDto>
  })
  data: PaginatedData<UserPostDto>;
}

export class UserCommentsResponseDto {
  @ApiProperty({
    description: 'User comments data',
    type: PaginatedData<UserCommentDto>
  })
  data: PaginatedData<UserCommentDto>;
}
