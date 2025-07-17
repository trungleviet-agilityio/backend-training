/**
 * User repository
 *
 * This repository is responsible for the database operations related to the user entity.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import {
  IUserRepository,
  PaginatedComments,
  PaginatedPosts,
  UserStats,
} from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  /**
   * Constructor
   * @param userRepository - The repository for the user entity
   * @param postRepository - The repository for the post entity
   * @param commentRepository - The repository for the comment entity
   */

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
      throw new Error('User not found');
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
      throw new Error('User not found');
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
      throw new Error('User not found');
    }

    return user;
  }

  async update(uuid: string, data: Partial<User>): Promise<User> {
    /**
     * Update a user
     * @param uuid - The UUID of the user
     * @param data - The data to update
     * @returns The updated user
     */

    await this.userRepository.update(uuid, data);
    return this.findById(uuid);
  }

  async getUserStats(uuid: string): Promise<UserStats> {
    /**
     * Get a user's stats
     * @param uuid - The UUID of the user
     * @returns The user's stats
     */

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
}
