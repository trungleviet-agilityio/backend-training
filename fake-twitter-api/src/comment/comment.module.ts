/**
 * Comment module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../database/entities/comment.entity';
import { User } from '../database/entities/user.entity';
import { Post } from '../database/entities/post.entity';
import { CommentController } from './comment.controller';
import { CommentService, CommentMapperService } from './services';
import { CommentOperationFactory } from './factories/comment-operation.factory';
import { AdminCommentStrategy, ModeratorCommentStrategy, RegularCommentStrategy } from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentMapperService,
    CommentOperationFactory,
    AdminCommentStrategy,
    ModeratorCommentStrategy,
    RegularCommentStrategy,
  ],
  exports: [CommentService],
})
export class CommentModule {}
