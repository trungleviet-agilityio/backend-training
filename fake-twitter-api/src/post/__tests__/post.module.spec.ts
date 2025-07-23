/**
 * PostModule Unit Tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostModule } from '../post.module';
import { PostController } from '../post.controller';
import { PostService } from '../services/post.service';
import { PostMapperService } from '../services/post-mapper.service';
import { PostOperationFactory } from '../factories/post-operation.factory';
import {
  AdminPostStrategy,
  ModeratorPostStrategy,
  RegularPostStrategy,
} from '../strategies';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { Repository } from 'typeorm';

describe('PostModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PostModule],
    })
      .overrideProvider(getRepositoryToken(Post))
      .useValue({} as Repository<Post>)
      .overrideProvider(getRepositoryToken(User))
      .useValue({} as Repository<User>)
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

  it('should provide PostController', () => {
    const postController = module.get<PostController>(PostController);
    expect(postController).toBeDefined();
    expect(postController).toBeInstanceOf(PostController);
  });

  it('should provide PostService', () => {
    const postService = module.get<PostService>(PostService);
    expect(postService).toBeDefined();
    expect(postService).toBeInstanceOf(PostService);
  });

  it('should provide PostMapperService', () => {
    const postMapperService = module.get<PostMapperService>(PostMapperService);
    expect(postMapperService).toBeDefined();
    expect(postMapperService).toBeInstanceOf(PostMapperService);
  });

  it('should provide PostOperationFactory', () => {
    const postOperationFactory =
      module.get<PostOperationFactory>(PostOperationFactory);
    expect(postOperationFactory).toBeDefined();
    expect(postOperationFactory).toBeInstanceOf(PostOperationFactory);
  });

  it('should provide AdminPostStrategy', () => {
    const adminPostStrategy = module.get<AdminPostStrategy>(AdminPostStrategy);
    expect(adminPostStrategy).toBeDefined();
    expect(adminPostStrategy).toBeInstanceOf(AdminPostStrategy);
  });

  it('should provide ModeratorPostStrategy', () => {
    const moderatorPostStrategy = module.get<ModeratorPostStrategy>(
      ModeratorPostStrategy,
    );
    expect(moderatorPostStrategy).toBeDefined();
    expect(moderatorPostStrategy).toBeInstanceOf(ModeratorPostStrategy);
  });

  it('should provide RegularPostStrategy', () => {
    const regularPostStrategy =
      module.get<RegularPostStrategy>(RegularPostStrategy);
    expect(regularPostStrategy).toBeDefined();
    expect(regularPostStrategy).toBeInstanceOf(RegularPostStrategy);
  });

  it('should export PostService', () => {
    const postService = module.get<PostService>(PostService);
    expect(postService).toBeInstanceOf(PostService);
  });
});
