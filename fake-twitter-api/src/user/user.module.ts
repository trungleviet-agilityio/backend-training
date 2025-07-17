/**
 * User module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Post } from '../database/entities/post.entity';
import { Comment } from '../database/entities/comment.entity';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { UserOperationFactory } from './factories/user-operation.factory';
import { AdminUserStrategy } from './strategies/user-admin.strategy';
import { ModeratorUserStrategy } from './strategies/user-moderator.strategy';
import { RegularUserStrategy } from './strategies/user-regular.strategy';
import { UserMapperService } from './services/user-mapper.service';
import { PostMapperService } from '../post/services';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  controllers: [UserController],
  providers: [
    UserService,
    UserMapperService,
    UserOperationFactory,
    AdminUserStrategy,
    ModeratorUserStrategy,
    RegularUserStrategy,
    PostMapperService,
  ],
  exports: [UserService],
})
export class UserModule {}
