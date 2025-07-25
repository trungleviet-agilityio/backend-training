/**
 * User controller
 */

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserService } from './services/user.service';
import { User } from '../database/entities/user.entity';
import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';

import {
  UserCommentsResponseDto,
  UserDeletedResponseDto,
  UserPostsResponseDto,
  UserProfileResponseDto,
  UserStatsResponseDto,
} from './dto/user-response.dto';
import {
  UserForbiddenErrorDto,
  UserInternalServerErrorDto,
  UserNotFoundErrorDto,
  UserUnauthorizedErrorDto,
} from './dto/user-error.dto';
import { UserUpdatePayloadDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':uuid')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserProfileResponseDto,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: UserForbiddenErrorDto,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async getUserProfile(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserProfileResponseDto> {
    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as User;

    const userProfile = await this.userService.getUserProfile(
      currentUserObj,
      uuid,
    );
    return userProfile;
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UserUpdatePayloadDto })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserProfileResponseDto,
    description: 'Profile updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: UserForbiddenErrorDto,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async updateUserProfile(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UserUpdatePayloadDto,
  ): Promise<UserProfileResponseDto> {
    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as User;

    const updatedUser = await this.userService.updateUserProfile(
      currentUserObj,
      uuid,
      updateUserDto,
    );

    return updatedUser;
  }

  @Get(':uuid/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserStatsResponseDto,
    description: 'User statistics retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async getUserStats(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserStatsResponseDto> {
    const stats = await this.userService.getUserStats(uuid);
    return stats;
  }

  @Get(':uuid/posts')
  @ApiOperation({ summary: 'Get user posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPostsResponseDto,
    description: 'User posts retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async getUserPosts(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<UserPostsResponseDto> {
    const result = await this.userService.getUserPosts(uuid, page, limit);
    return result;
  }

  @Get(':uuid/comments')
  @ApiOperation({ summary: 'Get user comments' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserCommentsResponseDto,
    description: 'User comments retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async getUserComments(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<UserCommentsResponseDto> {
    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as User;

    const result = await this.userService.getUserComments(
      currentUserObj,
      uuid,
      page,
      limit,
    );
    return result;
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDeletedResponseDto,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: UserUnauthorizedErrorDto,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: UserForbiddenErrorDto,
    description: 'Forbidden - Admin role required to delete users',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: UserNotFoundErrorDto,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: UserInternalServerErrorDto,
    description: 'Internal server error',
  })
  async deleteUser(
    @CurrentUser() currentUser: IJwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserDeletedResponseDto> {
    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as User;

    await this.userService.deleteUser(currentUserObj, uuid);

    return new UserDeletedResponseDto();
  }
}
