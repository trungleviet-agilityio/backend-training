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

  async findById(
    uuid: string,
    currentUser?: { uuid: string; role: { name: string } },
  ): Promise<Post> {
    /**
     * Find a post by its UUID with optional permission check
     * @param uuid - The UUID of the post
     * @param currentUser - Optional current user for permission check
     * @returns The post
     */

    const post = await this.postRepository.findOne({
      where: { uuid },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If current user is provided, check permissions
    if (currentUser) {
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

      if (!strategy.canViewPost(user, post)) {
        throw new ForbiddenException('You cannot view this post');
      }
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

    console.log('PostService.createPost - currentUser:', currentUser);
    console.log(
      'PostService.createPost - currentUser.uuid:',
      currentUser?.uuid,
    );
    console.log(
      'PostService.createPost - currentUser.role:',
      currentUser?.role,
    );

    const user = await this.userRepository.findOne({
      where: { uuid: currentUser.uuid },
      relations: ['role'],
    });

    console.log('PostService.createPost - user found:', user);
    console.log('PostService.createPost - user.uuid:', user?.uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(
      'PostService.createPost - creating strategy with role:',
      currentUser.role.name,
    );

    const strategy = this.postOperationFactory.createStrategy(
      currentUser.role.name,
    );

    console.log('PostService.createPost - strategy created:', strategy);

    if (!strategy.canCreatePost(user)) {
      throw new ForbiddenException('You cannot create posts');
    }

    if (!strategy.validateCreateData(user, createData)) {
      throw new ForbiddenException('Invalid post data for your role');
    }

    console.log(
      'PostService.createPost - about to create post with authorUuid:',
      user.uuid,
    );

    const post = this.postRepository.create({
      ...createData,
      authorUuid: user.uuid,
    });

    console.log('PostService.createPost - post created:', post);

    const savedPost = await this.postRepository.save(post);

    // Load the post with author relation for the mapper
    const postWithAuthor = await this.postRepository.findOne({
      where: { uuid: savedPost.uuid },
      relations: ['author'],
    });

    if (!postWithAuthor) {
      throw new NotFoundException('Post not found after creation');
    }

    return postWithAuthor;
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
