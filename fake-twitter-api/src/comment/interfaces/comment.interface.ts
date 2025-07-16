/**
 * This file contains the interfaces for the comment module.
 */

import { Comment } from '../../database/entities/comment.entity';

export interface PaginatedComments {
  data: Comment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
