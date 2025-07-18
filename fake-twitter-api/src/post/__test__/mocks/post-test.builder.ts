/**
 * Post Test Builder
 * Following the Builder Pattern for creating test data
 */

import { Post } from '../../../database/entities/post.entity';
import { User } from '../../../database/entities/user.entity';

export class PostTestBuilder {
  private post: Partial<Post> = {
    uuid: 'post-uuid',
    content: 'Test post content',
    authorUuid: 'user-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  withUuid(uuid: string): PostTestBuilder {
    this.post.uuid = uuid;
    return this;
  }

  withContent(content: string): PostTestBuilder {
    this.post.content = content;
    return this;
  }

  withAuthorUuid(authorUuid: string): PostTestBuilder {
    this.post.authorUuid = authorUuid;
    return this;
  }

  withAuthor(author: User): PostTestBuilder {
    this.post.author = author;
    return this;
  }

  build(): Post {
    return this.post as Post;
  }
}
