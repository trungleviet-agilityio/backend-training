/**
 * Authentication Module
 * Provides JWT-based authentication services and strategies
 */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const secret = process.env.JWT_SECRET || 'default-secret-key';
        const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
