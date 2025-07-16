import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '../database/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { AuthSession } from '../database/entities/auth-session.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthPasswordReset } from '../database/entities/auth-password-reset.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtAuthGuard, RolesGuard } from './guards';
import { AuthController } from './auth.controller';
import { NotificationModule } from '../notifications/notification.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, AuthSession, AuthPasswordReset]),
    PassportModule,
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
    JwtStrategy,
    LocalStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
