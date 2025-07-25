import { ApiProperty } from '@nestjs/swagger';
import {
  DeletedResponse,
  PaginatedData,
  PaginatedResponse,
  PaginationMeta,
  SuccessResponse,
} from '../../common';
import {
  BaseUserDto,
  UserCommentDto,
  UserPostDto,
  UserProfileDto,
  UserStatsDto,
} from './user.dto';

export class UserBaseResponseDto extends SuccessResponse<BaseUserDto> {
  @ApiProperty({ type: BaseUserDto, description: 'User data' })
  declare data: BaseUserDto;

  constructor(data: BaseUserDto) {
    super(data);
  }
}

export class UserProfileResponseDto extends SuccessResponse<UserProfileDto> {
  @ApiProperty({ type: UserProfileDto, description: 'User profile data' })
  declare data: UserProfileDto;

  constructor(data: UserProfileDto) {
    super(data);
  }
}

export class UserPostsResponseDto extends PaginatedResponse<UserPostDto> {
  @ApiProperty({ type: PaginatedData, description: 'User posts data' })
  declare data: PaginatedData<UserPostDto>;

  constructor(data: UserPostDto[], meta: PaginationMeta) {
    super(data, meta);
  }
}

export class UserCommentsResponseDto extends PaginatedResponse<UserCommentDto> {
  @ApiProperty({ type: PaginatedData, description: 'User comments data' })
  declare data: PaginatedData<UserCommentDto>;

  constructor(data: UserCommentDto[], meta: PaginationMeta) {
    super(data, meta);
  }
}

export class UserDeletedResponseDto extends DeletedResponse {
  @ApiProperty({
    description: 'User deleted data',
    type: 'null',
    nullable: true,
  })
  declare data: null;

  constructor(message = 'User deleted successfully') {
    super(message);
  }
}

export class UserStatsResponseDto extends SuccessResponse<UserStatsDto> {
  @ApiProperty({ description: 'User stats data' })
  declare data: UserStatsDto;

  constructor(data: UserStatsDto) {
    super(data);
  }
}
