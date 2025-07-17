import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { UserOperationFactory } from '../factories/user-operation.factory';
import { UserMapperService } from './user-mapper.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserProfileDto } from '../dto/user-response.dto';
import {
  PaginatedComments,
  PaginatedPosts,
  UserStats,
} from '../interfaces/user.interface';

@Injectable()
export class UserService {
  /**
   * Constructor
   * @param userRepository - The repository for the user entity
   * @param postRepository - The repository for the post entity
   * @param commentRepository - The repository for the comment entity
   * @param userOperationFactory - The factory for the user operation
   * @param userMapper - The mapper for the user
   */

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userOperationFactory: UserOperationFactory,
    private readonly userMapper: UserMapperService,
  ) {}

  async findById(uuid: string): Promise<User> {
    /**
     * Find a user by their UUID
     * @param uuid - The UUID of the user
     * @returns The user
     */

    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    /**
     * Find a user by their email
     * @param email - The email of the user
     * @returns The user
     */

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    /**
     * Find a user by their username
     * @param username - The username of the user
     * @returns The user
     */

    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserProfile(uuid: string): Promise<UserProfileDto> {
    /**
     * Get a user's profile
     * @param uuid - The UUID of the user
     * @returns The user's profile
     */

    const user = await this.findById(uuid);
    const stats = await this.getUserStats(uuid);

    return this.userMapper.toUserProfileDto(user, stats);
  }

  async updateProfile(
    currentUser: User,
    targetUuid: string,
    updateData: UpdateUserDto,
  ): Promise<User> {
    /**
     * Update a user's profile
     * @param currentUser - The current user
     * @param targetUuid - The UUID of the target user
     * @param updateData - The data to update
     * @returns The updated user
     */

    const targetUser = await this.findById(targetUuid);
    const strategy = this.userOperationFactory.createStrategy(
      currentUser.role.name,
    );

    if (!strategy.canUpdateUser(currentUser, targetUser)) {
      throw new ForbiddenException('You cannot update this user');
    }

    if (!strategy.validateUpdateData(currentUser, targetUser, updateData)) {
      throw new ForbiddenException('Invalid update data for your role');
    }

    await this.userRepository.update(targetUuid, updateData);
    return this.findById(targetUuid);
  }

  async getUserStats(uuid: string): Promise<UserStats> {
    /**
     * Get a user's stats
     * @param uuid - The UUID of the user
     * @returns The user's stats
     */

    await this.findById(uuid); // Verify user exists

    const [postsCount, commentsCount] = await Promise.all([
      this.postRepository.count({ where: { authorUuid: uuid } }),
      this.commentRepository.count({ where: { authorUuid: uuid } }),
    ]);

    return {
      postsCount,
      commentsCount,
      followersCount: 0, // TODO: Implement when adding follow system
      followingCount: 0, // TODO: Implement when adding follow system
    };
  }

  async getUserPosts(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedPosts> {
    /**
     * Get a user's posts
     * @param uuid - The UUID of the user
     * @param page - The page number
     * @param limit - The number of posts per page
     * @returns The user's posts
     */

    await this.findById(uuid); // Verify user exists

    const [posts, total] = await this.postRepository.findAndCount({
      where: { authorUuid: uuid },
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserComments(
    uuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedComments> {
    /**
     * Get a user's comments
     * @param uuid - The UUID of the user
     * @param page - The page number
     * @param limit - The number of comments per page
     * @returns The user's comments
     */

    await this.findById(uuid); // Verify user exists

    const [comments, total] = await this.commentRepository.findAndCount({
      where: { authorUuid: uuid },
      relations: ['author', 'post'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteUser(currentUser: User, targetUuid: string): Promise<void> {
    /**
     * Delete a user
     * @param currentUser - The current user performing the deletion
     * @param targetUuid - The UUID of the user to delete
     * @returns void
     */

    const targetUser = await this.findById(targetUuid);
    const strategy = this.userOperationFactory.createStrategy(
      currentUser.role.name,
    );

    if (!strategy.canDeleteUser(currentUser, targetUser)) {
      // Provide more specific error messages based on the scenario
      if (currentUser.uuid === targetUser.uuid) {
        throw new ForbiddenException('You cannot delete your own account');
      }

      if (currentUser.role.name !== 'admin') {
        throw new ForbiddenException('Only administrators can delete users');
      }

      throw new ForbiddenException('You do not have permission to delete this user');
    }

    await this.userRepository.softRemove(targetUser);
    await this.userRepository.update(targetUuid, { deleted: true, isActive: false });
  }
}
