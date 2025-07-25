/**
 * This file contains the tests for the post entity.
 */

import { Post } from '../../entities';

describe('Post Entity', () => {
  it('should instantiate and assign properties', () => {
    const post = new Post({
      content: 'Hello',
      authorUuid: 'user-uuid',
      likesCount: 5,
      commentsCount: 2,
      isPublished: true,
    });
    expect(post.content).toBe('Hello');
    expect(post.authorUuid).toBe('user-uuid');
    expect(post.likesCount).toBe(5);
    expect(post.commentsCount).toBe(2);
    expect(post.isPublished).toBe(true);
  });
});
