/**
 * This file contains the tests for the comment operation factory.
 */

import { CommentOperationFactory } from '../factories/comment-operation.factory';
import { AdminCommentStrategy } from '../strategies/comment-admin.strategy';
import { ModeratorCommentStrategy } from '../strategies/comment-moderator.strategy';
import { RegularCommentStrategy } from '../strategies/comment-regular.strategy';

describe('CommentOperationFactory', () => {
  let adminStrategy: jest.Mocked<AdminCommentStrategy>;
  let moderatorStrategy: jest.Mocked<ModeratorCommentStrategy>;
  let regularStrategy: jest.Mocked<RegularCommentStrategy>;
  let factory: CommentOperationFactory;

  beforeEach(() => {
    adminStrategy = { canCreateComment: jest.fn() } as any;
    moderatorStrategy = { canCreateComment: jest.fn() } as any;
    regularStrategy = { canCreateComment: jest.fn() } as any;
    factory = new CommentOperationFactory(
      adminStrategy,
      moderatorStrategy,
      regularStrategy,
    );
  });

  it('should return admin strategy for admin role', () => {
    const result = factory.createStrategy('admin');
    expect(result).toBe(adminStrategy);
  });

  it('should return moderator strategy for moderator role', () => {
    const result = factory.createStrategy('moderator');
    expect(result).toBe(moderatorStrategy);
  });

  it('should return regular strategy for any other role', () => {
    expect(factory.createStrategy('user')).toBe(regularStrategy);
    expect(factory.createStrategy('guest')).toBe(regularStrategy);
    expect(factory.createStrategy('')).toBe(regularStrategy);
    expect(factory.createStrategy(undefined as any)).toBe(regularStrategy);
  });
});
