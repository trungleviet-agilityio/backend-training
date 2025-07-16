import { ApiProperty } from '@nestjs/swagger';

/**
 * Single source of truth for global response structure
 * Matches the ResponseInterceptor output
 */
export class GlobalResponseDto<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'User profile retrieved successfully'
  })
  message: string;

  @ApiProperty({
    description: 'Response data payload'
  })
  data: T;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2025-07-16T05:00:24.853Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/v1/users/a6e7d9d0-c122-45ba-9333-a473a363b6d4'
  })
  path: string;
}

/**
 * Specialized response DTOs for common patterns
 */
export class PaginatedGlobalResponseDto<T> extends GlobalResponseDto<{
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> {}

export class MessageGlobalResponseDto extends GlobalResponseDto<{ message: string }> {}

// User-specific response DTOs with proper data structure
export class UserProfileGlobalResponseDto extends GlobalResponseDto<{
  user: {
    uuid: string;
    username: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
    role: { name: string };
    stats: {
      postsCount: number;
      commentsCount: number;
    };
    createdAt: string;
  };
}> {}

export class UserStatsGlobalResponseDto extends GlobalResponseDto<{
  postsCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
}> {}

export class UserPostsGlobalResponseDto extends PaginatedGlobalResponseDto<{
  uuid: string;
  content: string;
  author: {
    uuid: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  stats: {
    likesCount: number;
    commentsCount: number;
  };
  createdAt: string;
}> {}

export class UserCommentsGlobalResponseDto extends PaginatedGlobalResponseDto<{
  uuid: string;
  content: string;
  post: {
    uuid: string;
    content: string;
    author: {
      uuid: string;
      username: string;
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
  stats: {
    likesCount: number;
  };
  createdAt: string;
}> {}

export class UserDeletedGlobalResponseDto extends GlobalResponseDto<{
  message: string;
  deletedUser: {
    uuid: string;
    username: string;
  };
}> {}
