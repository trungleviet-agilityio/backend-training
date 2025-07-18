/**
 * Comment Test Builder
 * Following the Builder Pattern for creating test data
 */

import { Comment } from '../../../database/entities/comment.entity';
import { User } from '../../../database/entities/user.entity';
import { Post } from '../../../database/entities/post.entity';

export class CommentTestBuilder {
  private comment: Partial<Comment> = {
    uuid: 'comment-uuid',
    content: 'Test comment content',
    authorUuid: 'user-uuid',
    postUuid: 'post-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  withAuthor(author: User): CommentTestBuilder {
    this.comment.author = author;
    return this;
  }

  withPost(post: Post): CommentTestBuilder {
    this.comment.post = post;
    return this;
  }

  build(): Comment {
    return this.comment as Comment;
  }
}
