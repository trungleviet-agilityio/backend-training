/**
 * Post Test Builder
 * Following the Builder Pattern for creating test data
 * Comprehensive scenario building for post module tests
 */

import { Post } from '../../../database/entities/post.entity';
import { User } from '../../../database/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from '../../dto';
import { PaginatedPosts } from '../../interfaces';
import { PostMockProvider } from './post-mock.provider';

export interface PostTestScenario {
  currentUser?: User;
  targetPost?: Post;
  createDto?: CreatePostDto;
  updateDto?: UpdatePostDto;
  paginatedPosts?: PaginatedPosts;
  error?: Error;
  userStats?: { postsCount: number; commentsCount: number };
}

export class PostTestBuilder {
  private scenario: PostTestScenario = {};

  withCurrentUser(user: User): PostTestBuilder {
    this.scenario.currentUser = user;
    return this;
  }

  withTargetPost(post: Post): PostTestBuilder {
    this.scenario.targetPost = post;
    return this;
  }

  withCreateDto(dto: CreatePostDto): PostTestBuilder {
    this.scenario.createDto = dto;
    return this;
  }

  withUpdateDto(dto: UpdatePostDto): PostTestBuilder {
    this.scenario.updateDto = dto;
    return this;
  }

  withPaginatedPosts(
    posts: Post[],
    page = 1,
    limit = 10,
    total = 0,
  ): PostTestBuilder {
    this.scenario.paginatedPosts = PostMockProvider.createMockPaginatedPosts(
      posts,
      page,
      limit,
      total,
    );
    return this;
  }

  withError(error: Error): PostTestBuilder {
    this.scenario.error = error;
    return this;
  }

  withUserStats(stats: {
    postsCount: number;
    commentsCount: number;
  }): PostTestBuilder {
    this.scenario.userStats = stats;
    return this;
  }

  build(): PostTestScenario {
    return { ...this.scenario };
  }

  // Convenience methods for common scenarios
  withCreatePostScenario(): this {
    this.scenario.currentUser = PostMockProvider.createMockUser();
    this.scenario.createDto = PostMockProvider.createMockCreatePostDto();
    return this;
  }

  withUpdatePostScenario(): this {
    this.scenario.currentUser = PostMockProvider.createMockUser();
    this.scenario.targetPost = PostMockProvider.createMockPost();
    this.scenario.updateDto = PostMockProvider.createMockUpdatePostDto();
    return this;
  }

  withAdminUserScenario(): this {
    this.scenario.currentUser = PostMockProvider.createMockUser({ role: { name: 'admin' } as any });
    this.scenario.targetPost = PostMockProvider.createMockPost();
    this.scenario.createDto = PostMockProvider.createMockCreatePostDto();
    this.scenario.updateDto = PostMockProvider.createMockUpdatePostDto();
    return this;
  }

  withRegularUserScenario(): this {
    this.scenario.currentUser = PostMockProvider.createMockUser({ role: { name: 'user' } as any });
    this.scenario.targetPost = PostMockProvider.createMockPost();
    this.scenario.createDto = PostMockProvider.createMockCreatePostDto();
    this.scenario.updateDto = PostMockProvider.createMockUpdatePostDto();
    return this;
  }

  withModeratorUserScenario(): this {
    this.scenario.currentUser = PostMockProvider.createMockUser({ role: { name: 'moderator' } as any });
    this.scenario.targetPost = PostMockProvider.createMockPost();
    this.scenario.createDto = PostMockProvider.createMockCreatePostDto();
    this.scenario.updateDto = PostMockProvider.createMockUpdatePostDto();
    return this;
  }
}
