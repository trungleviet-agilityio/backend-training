/**
 * Comment Test Builder
 */

import { Comment } from '../../../database/entities/comment.entity';
import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';
import { CreateCommentDto, UpdateCommentDto } from '../../dto';
import { IJwtPayload } from '../../../auth/interfaces/jwt-payload.interface';
import { PaginatedComments } from '../../interfaces';

export class CommentTestBuilder {
  private comment: Partial<Comment> = {
    uuid: 'comment-uuid-123',
    content: 'Test comment content',
    authorUuid: 'user-uuid-123',
    postUuid: 'post-uuid-123',
    parentUuid: undefined,
    depthLevel: 0,
    likesCount: 0,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  private targetComment: Comment | null = null;
  private currentUser: { uuid: string; role: { name: string } } | null = null;
  private jwtPayload: IJwtPayload | null = null;
  private createDto: CreateCommentDto | null = null;
  private updateDto: UpdateCommentDto | null = null;
  private postComments: PaginatedComments | null = null;
  private commentReplies: PaginatedComments | null = null;
  private targetUser: User | null = null;
  private targetPost: Post | null = null;
  private paginatedComments: PaginatedComments | null = null;
  private commentDtos: any[] | null = null;
  private commentDto: any | null = null;

  withUuid(uuid: string): CommentTestBuilder {
    this.comment.uuid = uuid;
    return this;
  }

  withContent(content: string): CommentTestBuilder {
    this.comment.content = content;
    return this;
  }

  withAuthorUuid(authorUuid: string): CommentTestBuilder {
    this.comment.authorUuid = authorUuid;
    return this;
  }

  withPostUuid(postUuid: string): CommentTestBuilder {
    this.comment.postUuid = postUuid;
    return this;
  }

  withParentUuid(parentUuid: string | undefined): CommentTestBuilder {
    this.comment.parentUuid = parentUuid;
    return this;
  }

  withDepthLevel(depthLevel: number): CommentTestBuilder {
    this.comment.depthLevel = depthLevel;
    return this;
  }

  withLikesCount(likesCount: number): CommentTestBuilder {
    this.comment.likesCount = likesCount;
    return this;
  }

  withAuthor(author: User): CommentTestBuilder {
    this.comment.author = author;
    return this;
  }

  withPost(post: Post): CommentTestBuilder {
    this.comment.post = post;
    return this;
  }

  withTargetComment(comment: Comment): CommentTestBuilder {
    this.targetComment = comment;
    return this;
  }

  withCurrentUser(currentUser: { uuid: string; role: { name: string } }): CommentTestBuilder {
    this.currentUser = currentUser;
    return this;
  }

  withJwtPayload(jwtPayload: IJwtPayload): CommentTestBuilder {
    this.jwtPayload = jwtPayload;
    return this;
  }

  withCreateDto(createDto: CreateCommentDto): CommentTestBuilder {
    this.createDto = createDto;
    return this;
  }

  withUpdateDto(updateDto: UpdateCommentDto): CommentTestBuilder {
    this.updateDto = updateDto;
    return this;
  }

  withPostComments(postComments: PaginatedComments): CommentTestBuilder {
    this.postComments = postComments;
    return this;
  }

  withCommentReplies(commentReplies: PaginatedComments): CommentTestBuilder {
    this.commentReplies = commentReplies;
    return this;
  }

  withTargetUser(user: User): CommentTestBuilder {
    this.targetUser = user;
    return this;
  }

  withTargetPost(post: Post): CommentTestBuilder {
    this.targetPost = post;
    return this;
  }

  withPaginatedComments(paginatedComments: PaginatedComments): CommentTestBuilder {
    this.paginatedComments = paginatedComments;
    return this;
  }

  withCommentDtos(commentDtos: any[]): CommentTestBuilder {
    this.commentDtos = commentDtos;
    return this;
  }

  withCommentDto(commentDto: any): CommentTestBuilder {
    this.commentDto = commentDto;
    return this;
  }

  build(): {
    comment: Comment;
    targetComment: Comment | null;
    currentUser: { uuid: string; role: { name: string } } | null;
    jwtPayload: IJwtPayload | null;
    createDto: CreateCommentDto | null;
    updateDto: UpdateCommentDto | null;
    postComments: PaginatedComments | null;
    commentReplies: PaginatedComments | null;
    targetUser: User | null;
    targetPost: Post | null;
    paginatedComments: PaginatedComments | null;
    commentDtos: any[] | null;
    commentDto: any | null;
  } {
    return {
      comment: this.comment as Comment,
      targetComment: this.targetComment,
      currentUser: this.currentUser,
      jwtPayload: this.jwtPayload,
      createDto: this.createDto,
      updateDto: this.updateDto,
      postComments: this.postComments,
      commentReplies: this.commentReplies,
      targetUser: this.targetUser,
      targetPost: this.targetPost,
      paginatedComments: this.paginatedComments,
      commentDtos: this.commentDtos,
      commentDto: this.commentDto,
    };
  }
}
