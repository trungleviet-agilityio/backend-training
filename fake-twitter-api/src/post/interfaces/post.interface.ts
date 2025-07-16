/**
 * Post interfaces
 */

import { Post } from '../../database/entities/post.entity';

export interface PaginatedPosts {
  /**
   * Paginated posts
   * @param data - The posts
   * @param meta - The metadata
   */

  data: Post[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PostStats {
  /**
   * Post stats
   * @param likesCount - The number of likes
   * @param commentsCount - The number of comments
   */

  likesCount: number;
  commentsCount: number;
}
