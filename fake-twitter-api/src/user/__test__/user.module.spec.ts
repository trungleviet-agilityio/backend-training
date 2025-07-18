/**
 * User module unit tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserModule } from '../user.module';
import { UserService } from '../services/user.service';
import { UserController } from '../user.controller';
import { UserMapperService } from '../services/user-mapper.service';
import { UserOperationFactory } from '../factories/user-operation.factory';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';

describe('UserModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(getRepositoryToken(Post))
      .useValue({})
      .overrideProvider(getRepositoryToken(Comment))
      .useValue({})
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

  it('should provide UserMapperService', () => {
    const userMapperService = module.get<UserMapperService>(UserMapperService);
    expect(userMapperService).toBeDefined();
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
