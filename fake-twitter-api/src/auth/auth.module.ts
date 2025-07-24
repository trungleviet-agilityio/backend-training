/**
 * Auth module
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../database/entities/user.entity';
import { Role } from '../database/entities/role.entity';
import { AuthSession } from '../database/entities/auth-session.entity';
import { AuthPasswordReset } from '../database/entities/auth-password-reset.entity';

import { AuthController } from './auth.controller';

import {
  AuthService,
  AuthUserService,
  AuthTokenService,
  AuthPasswordService,
  AuthSessionService,
  AuthErrorHandler,
  AuthPasswordResetService,
} from './services';

import { JwtStrategy } from './strategies';
import { JwtAuthGuard, RolesGuard } from './guards';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, AuthSession, AuthPasswordReset]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUserService,
    AuthTokenService,
    AuthPasswordService,
    AuthSessionService,
    AuthErrorHandler,
    AuthPasswordResetService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
