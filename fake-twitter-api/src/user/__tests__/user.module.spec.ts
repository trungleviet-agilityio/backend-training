/**
 * User module unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserModule } from '../user.module';
import { UserService } from '../services/user.service';
import { UserController } from '../user.controller';
import { UserOperationFactory } from '../factories/user-operation.factory';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { Repository } from 'typeorm';

describe('UserModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({} as Repository<User>)
      .overrideProvider(getRepositoryToken(Post))
      .useValue({} as Repository<Post>)
      .overrideProvider(getRepositoryToken(Comment))
      .useValue({} as Repository<Comment>)
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UserService', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
  });

  it('should provide UserController', () => {
    const userController = module.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should provide UserOperationFactory', () => {
    const userOperationFactory =
      module.get<UserOperationFactory>(UserOperationFactory);
    expect(userOperationFactory).toBeDefined();
  });

  it('should export UserService', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeInstanceOf(UserService);
  });
});
