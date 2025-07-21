/**
 * Comment module unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentModule } from '../comment.module';
import { CommentService } from '../services/comment.service';
import { CommentController } from '../comment.controller';
import { CommentMapperService } from '../services/comment-mapper.service';
import { CommentOperationFactory } from '../factories/comment-operation.factory';
import { Comment } from '../../database/entities/comment.entity';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { AdminCommentStrategy } from '../strategies/comment-admin.strategy';
import { ModeratorCommentStrategy } from '../strategies/comment-moderator.strategy';
import { RegularCommentStrategy } from '../strategies/comment-regular.strategy';
import { CommentMockProvider } from './mocks/comment-mock.provider';

describe('CommentModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    const mockCommentRepository = CommentMockProvider.createCommentRepository();
    const mockUserRepository = CommentMockProvider.createUserRepository();
    const mockPostRepository = CommentMockProvider.createPostRepository();
    
    // Create a more complete mock DataSource
    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
      }),
      transaction: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        softDelete: jest.fn(),
      },
    } as unknown as jest.Mocked<DataSource>;

    module = await Test.createTestingModule({
      imports: [CommentModule],
    })
      .overrideProvider(getRepositoryToken(Comment))
      .useValue(mockCommentRepository)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(Post))
      .useValue(mockPostRepository)
      .overrideProvider(DataSource)
      .useValue(mockDataSource)
      .compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CommentService', () => {
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeDefined();
  });

  it('should provide CommentController', () => {
    const commentController = module.get<CommentController>(CommentController);
    expect(commentController).toBeDefined();
  });

  it('should provide CommentMapperService', () => {
    const commentMapperService = module.get<CommentMapperService>(CommentMapperService);
    expect(commentMapperService).toBeDefined();
  });

  it('should provide CommentOperationFactory', () => {
    const commentOperationFactory =
      module.get<CommentOperationFactory>(CommentOperationFactory);
    expect(commentOperationFactory).toBeDefined();
  });

  it('should provide AdminCommentStrategy', () => {
    const adminStrategy = module.get<AdminCommentStrategy>(AdminCommentStrategy);
    expect(adminStrategy).toBeDefined();
  });

  it('should provide ModeratorCommentStrategy', () => {
    const moderatorStrategy = module.get<ModeratorCommentStrategy>(ModeratorCommentStrategy);
    expect(moderatorStrategy).toBeDefined();
  });

  it('should provide RegularCommentStrategy', () => {
    const regularStrategy = module.get<RegularCommentStrategy>(RegularCommentStrategy);
    expect(regularStrategy).toBeDefined();
  });

  it('should export CommentService', () => {
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeInstanceOf(CommentService);
  });
});
