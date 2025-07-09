/*
Auths controllers are used to define the controllers for the auths.
*/

import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { IAuth } from './auths.interface';
import { AuthsService } from './auths.service';
import { RequestLoggerService } from '../config/config.service';
import { AuthGuard, RateLimitGuard, RolesGuard } from '../core/guards';
import { Admin, Public, User } from '../core/decorators';
import { CurrentUser, UserPayload } from '../core/decorators';

@Controller('auths')
@UseGuards(AuthGuard)
@UseGuards(RateLimitGuard)
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly requestLogger: RequestLoggerService,
  ) {}

  @Post('register')
  @Public()
  register(@Body() auth: IAuth) {
    this.requestLogger.log("Registering user", "AuthsController");
    return this.authsService.register(auth);
  }

  @Post('login')
  @Public()
  login(@Body() auth: IAuth) {
    this.requestLogger.log("Logging in user", "AuthsController");
    return this.authsService.login(auth);
  }

  @Get('profile')
  @User()
  getProfile(@CurrentUser() user: UserPayload) {
    this.requestLogger.log("Getting user profile", "AuthsController");
    return {
      message: 'Profile retrieved successfully',
      user: user,
    };
  }

  @Get('admin')
  @Admin()
  getAdminInfo(@CurrentUser() user: UserPayload) {
    this.requestLogger.log("Getting admin info", "AuthsController");
    return {
      message: 'Admin information retrieved successfully',
      user: user,
      adminData: 'This is admin-only data',
    };
  }

  @Post('logout')
  @User()
  logout(@CurrentUser() user: UserPayload) {
    this.requestLogger.log("Logging out user", "AuthsController");
    return {
      message: 'Logged out successfully',
      user: user,
    };
  }
}
