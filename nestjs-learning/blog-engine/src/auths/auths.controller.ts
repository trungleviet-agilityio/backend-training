/*
Auths controllers are used to define the controllers for the auths.
*/

import { Controller, Post, Body } from '@nestjs/common';
import { IAuth } from './auths.interface';
import { AuthsService } from './auths.service';
import { RequestLoggerService } from '../config/config.service';

/*
AuthsController is a controller that provides the auths functionality for the application.
*/
@Controller('auths')
export class AuthsController {
  constructor(
    private readonly authsService: AuthsService,
    private readonly requestLogger: RequestLoggerService,
  ) {}

  /*
  register is a method that registers a new user.
  */
  @Post('register')
  register(@Body() auth: IAuth) {
    this.requestLogger.log("Registering user", "AuthsController");
    return this.authsService.register(auth);
  }

  /*
  login is a method that logs in a user.
  */
  @Post('login')
  login(@Body() auth: IAuth) {
    this.requestLogger.log("Logging in user", "AuthsController");
    return this.authsService.login(auth);
  }
}
