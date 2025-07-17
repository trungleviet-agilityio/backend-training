import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PostMapperService } from '../post/services';


@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  /**
   * Constructor
   * @param userService - The service for the user
   */

  constructor(
    private readonly userService: UserService,
    private readonly postMapper: PostMapperService,
  ) {}

  @Get(':uuid')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserProfile(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserProfileResponseDto> {
    /**
     * Get a user's profile
     * @param uuid - The UUID of the user
     * @returns The user's profile
     */

    const user = await this.userService.getUserProfile(uuid);
    return { user };
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateProfile(
    @CurrentUser() currentUser: JwtPayload,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    /**
     * Update a user's profile
     * @param currentUser - The current user
     * @param uuid - The UUID of the target user
     * @param updateUserDto - The data to update
     * @returns The updated user
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    const updatedUser = await this.userService.updateProfile(
      currentUserObj,
      uuid,
      updateUserDto,
    );
    const user = await this.userService.getUserProfile(uuid);
    return { user };
  }

  @Get(':uuid/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserStats(@Param('uuid', ParseUUIDPipe) uuid: string) {
    /**
     * Get a user's stats
     * @param uuid - The UUID of the user
     * @returns The user's stats
     */

    return this.userService.getUserStats(uuid);
  }

  @Get(':uuid/posts')
  @ApiOperation({ summary: 'Get user posts' })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserPosts(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    /**
     * Get a user's posts
     * @param uuid - The UUID of the user
     * @param page - The page number
     * @param limit - The number of posts per page
     * @returns The user's posts
     */

    const result = await this.userService.getUserPosts(uuid, page, limit);

    // Use the post mapper to filter sensitive data
    return {
      data: this.postMapper.toPostDtoList(result.data),
      meta: result.meta,
    };
  }

  @Get(':uuid/comments')
  @ApiOperation({ summary: 'Get user comments' })
  @ApiResponse({
    status: 200,
    description: 'User comments retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserComments(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    /**
     * Get a user's comments
     * @param uuid - The UUID of the user
     * @param page - The page number
     * @param limit - The number of comments per page
     * @returns The user's comments
     */

    return this.userService.getUserComments(uuid, page, limit);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required to delete users'
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteUser(
    @CurrentUser() currentUser: JwtPayload,
    @Param('uuid', ParseUUIDPipe ) uuid: string,
  ): Promise<void> {
    /**
     * Delete a user (Admin only)
     * @param currentUser - The current user
     * @param uuid - The UUID of the user to delete
     * @returns void
     */

    const currentUserObj = {
      uuid: currentUser.sub,
      role: { name: currentUser.role },
    } as any;

    await this.userService.deleteUser(currentUserObj, uuid);
  }
}
