/**
 * CommentModule Unit Tests
 * Testing module structure and providers without full module import
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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
    const mockCommentOperationFactory =
      CommentMockProvider.createCommentOperationFactory();
    const mockCommentMapperService =
      CommentMockProvider.createCommentMapperService();
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

    // Test the module structure by providing all the same providers as CommentModule
    module = await Test.createTestingModule({
      providers: [
        // Controllers
        CommentController,
        // Services
        CommentService,
        CommentMapperService,
        // Factories
        CommentOperationFactory,
        // Strategies
        AdminCommentStrategy,
        ModeratorCommentStrategy,
        RegularCommentStrategy,
        // Repositories (mocked)
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        // DataSource (mocked)
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CommentController', () => {
    const commentController = module.get<CommentController>(CommentController);
    expect(commentController).toBeDefined();
    expect(commentController).toBeInstanceOf(CommentController);
  });

  it('should provide CommentService', () => {
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeDefined();
    expect(commentService).toBeInstanceOf(CommentService);
  });

  it('should provide CommentMapperService', () => {
    const commentMapperService =
      module.get<CommentMapperService>(CommentMapperService);
    expect(commentMapperService).toBeDefined();
    expect(commentMapperService).toBeInstanceOf(CommentMapperService);
  });

  it('should provide CommentOperationFactory', () => {
    const commentOperationFactory = module.get<CommentOperationFactory>(
      CommentOperationFactory,
    );
    expect(commentOperationFactory).toBeDefined();
    expect(commentOperationFactory).toBeInstanceOf(CommentOperationFactory);
  });

  it('should provide AdminCommentStrategy', () => {
    const adminStrategy =
      module.get<AdminCommentStrategy>(AdminCommentStrategy);
    expect(adminStrategy).toBeDefined();
    expect(adminStrategy).toBeInstanceOf(AdminCommentStrategy);
  });

  it('should provide ModeratorCommentStrategy', () => {
    const moderatorStrategy = module.get<ModeratorCommentStrategy>(
      ModeratorCommentStrategy,
    );
    expect(moderatorStrategy).toBeDefined();
    expect(moderatorStrategy).toBeInstanceOf(ModeratorCommentStrategy);
  });

  it('should provide RegularCommentStrategy', () => {
    const regularStrategy = module.get<RegularCommentStrategy>(
      RegularCommentStrategy,
    );
    expect(regularStrategy).toBeDefined();
    expect(regularStrategy).toBeInstanceOf(RegularCommentStrategy);
  });

  it('should have all required dependencies for CommentService', () => {
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeDefined();

    // Verify that all dependencies are properly injected
    const commentRepository = module.get(getRepositoryToken(Comment));
    const userRepository = module.get(getRepositoryToken(User));
    const postRepository = module.get(getRepositoryToken(Post));
    const dataSource = module.get(DataSource);
    const commentOperationFactory = module.get(CommentOperationFactory);
    const commentMapperService = module.get(CommentMapperService);

    expect(commentRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(dataSource).toBeDefined();
    expect(commentOperationFactory).toBeDefined();
    expect(commentMapperService).toBeDefined();
  });

  it('should have all required dependencies for CommentController', () => {
    const commentController = module.get<CommentController>(CommentController);
    expect(commentController).toBeDefined();

    // The controller should have access to the CommentService
    const commentService = module.get<CommentService>(CommentService);
    expect(commentService).toBeDefined();
  });
});
