/**
 * Post module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../database/entities/post.entity';
import { User } from '../database/entities/user.entity';
import { PostController } from './post.controller';
import { PostMapperService, PostService } from './services';
import { PostOperationFactory } from './factories/post-operation.factory';
import {
  AdminPostStrategy,
  ModeratorPostStrategy,
  RegularPostStrategy,
} from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostController],
  providers: [
    PostService,
    PostMapperService,
    PostOperationFactory,
    AdminPostStrategy,
    ModeratorPostStrategy,
    RegularPostStrategy,
  ],
  exports: [PostService],
})
export class PostModule {}
