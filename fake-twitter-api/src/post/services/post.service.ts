/**
 * Post service
 */

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { PostOperationFactory } from '../factories/post-operation.factory';
import { CreatePostDto, UpdatePostDto } from '../dto';
import { PaginatedPosts } from '../interfaces';
import { PostMapperService } from './post-mapper.service';

@Injectable()
export class PostService {
  /**
   * Constructor
   * @param postRepository - The repository for the post entity
   * @param userRepository - The repository for the user entity
   * @param postOperationFactory - The factory for the post operation
   * @param postMapper - The mapper for the post
   */

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly postOperationFactory: PostOperationFactory,
    private readonly postMapper: PostMapperService,
  ) {}

  async findById(uuid: string): Promise<Post> {
    /**
     * Find a post by its UUID
     * @param uuid - The UUID of the post
     * @returns The post
     */

    const post = await this.postRepository.findOne({
      where: { uuid },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getAllPosts(page: number, limit: number): Promise<PaginatedPosts> {
    /**
     * Get all published posts with pagination
     * @param page - The page number
     * @param limit - The number of posts per page
     * @returns Paginated posts
     */

    const [posts, total] = await this.postRepository.findAndCount({
      where: { isPublished: true },
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

  async createPost(
    currentUser: { uuid: string; role: { name: string } },
    createData: CreatePostDto,
  ): Promise<Post> {
    /**
     * Create a new post
     * @param currentUser - The current user
     * @param createData - The post data
     * @returns The created post
     */

    const user = await this.userRepository.findOne({
      where: { uuid: currentUser.uuid },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const strategy = this.postOperationFactory.createStrategy(
      currentUser.role.name,
    );

    if (!strategy.canCreatePost(user)) {
      throw new ForbiddenException('You cannot create posts');
    }

    if (!strategy.validateCreateData(user, createData)) {
      throw new ForbiddenException('Invalid post data for your role');
    }

    const post = this.postRepository.create({
      ...createData,
      authorUuid: user.uuid,
    });

    return this.postRepository.save(post);
  }

  async updatePost(
    currentUser: { uuid: string; role: { name: string } },
    postUuid: string,
    updateData: UpdatePostDto,
  ): Promise<Post> {
    /**
     * Update a post
     * @param currentUser - The current user
     * @param postUuid - The UUID of the post
     * @param updateData - The data to update
     * @returns The updated post
     */

    const post = await this.findById(postUuid);

    // Fetch the full user entity
    const user = await this.userRepository.findOne({
      where: { uuid: currentUser.uuid },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const strategy = this.postOperationFactory.createStrategy(
      currentUser.role.name,
    );

    if (!strategy.canUpdatePost(user, post)) {
      throw new ForbiddenException('You cannot update this post');
    }

    if (!strategy.validateUpdateData(user, post, updateData)) {
      throw new ForbiddenException('Invalid update data for your role');
    }

    await this.postRepository.update(postUuid, updateData);
    return this.findById(postUuid);
  }

  async deletePost(
    currentUser: { uuid: string; role: { name: string } },
    postUuid: string,
  ): Promise<void> {
    /**
     * Delete a post
     * @param currentUser - The current user
     * @param postUuid - The UUID of the post
     */

    const post = await this.findById(postUuid);

    // Fetch the full user entity
    const user = await this.userRepository.findOne({
      where: { uuid: currentUser.uuid },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const strategy = this.postOperationFactory.createStrategy(
      currentUser.role.name,
    );

    if (!strategy.canDeletePost(user, post)) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await this.postRepository.softDelete(postUuid);
  }

  async getUserPosts(
    userUuid: string,
    page: number,
    limit: number,
  ): Promise<PaginatedPosts> {
    /**
     * Get posts by a specific user
     * @param userUuid - The UUID of the user
     * @param page - The page number
     * @param limit - The number of posts per page
     * @returns Paginated posts
     */

    const [posts, total] = await this.postRepository.findAndCount({
      where: { authorUuid: userUuid, isPublished: true },
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
}
