/**
 * This module is responsible for configuring the database connection.
 * It uses the TypeORM library to connect to the database.
 * It also uses the ConfigService to get the database configuration from the .env file.
 */

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { AuthSession } from './entities/auth-session.entity';
import { AuthPasswordReset } from './entities/auth-password-reset.entity';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: configService.getOrThrow('DB_PORT'),
        database: configService.getOrThrow('DB_DATABASE'),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),

        entities: [User, Role, AuthSession, AuthPasswordReset, Post, Comment],
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
