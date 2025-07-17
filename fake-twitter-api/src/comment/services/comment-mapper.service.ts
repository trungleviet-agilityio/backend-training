/**
 * Comment mapper service
 */

import { Injectable } from '@nestjs/common';
import { Comment } from '../../database/entities/comment.entity';
import { CommentAuthorDto, CommentDto, CommentStatsDto } from '../dto';

@Injectable()
export class CommentMapperService {
  toCommentDto(comment: Comment): CommentDto {
    /**
     * Map a comment to a CommentDto
     * @param comment - The comment to map
     * @returns The CommentDto
     */

    const author: CommentAuthorDto = {
      uuid: comment.author.uuid,
      username: comment.author.username,
      firstName: comment.author.firstName || '',
      lastName: comment.author.lastName || '',
      avatarUrl: comment.author.avatarUrl,
    };

    const stats: CommentStatsDto = {
      likesCount: comment.likesCount,
    };

    return {
      uuid: comment.uuid,
      content: comment.content,
      author,
      stats,
      depthLevel: comment.depthLevel,
      parentUuid: comment.parentUuid,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  toCommentDtoList(comments: Comment[]): CommentDto[] {
    /**
     * Map a list of comments to a list of CommentDto
     * @param comments - The list of comments to map
     * @returns The list of CommentDto
     */

    return comments.map(comment => this.toCommentDto(comment));
  }
}
