/**
 * This file contains the tests for the comment entity.
 */

import { Comment } from '../../entities';

describe('Comment Entity', () => {
  it('should instantiate and assign properties', () => {
    const comment = new Comment({
      content: 'Nice!',
      authorUuid: 'user-uuid',
      postUuid: 'post-uuid',
      parentUuid: 'parent-uuid',
      depthLevel: 1,
      likesCount: 3,
    });
    expect(comment.content).toBe('Nice!');
    expect(comment.authorUuid).toBe('user-uuid');
    expect(comment.postUuid).toBe('post-uuid');
    expect(comment.parentUuid).toBe('parent-uuid');
    expect(comment.depthLevel).toBe(1);
    expect(comment.likesCount).toBe(3);
  });
});
