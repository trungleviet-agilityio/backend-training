/*
Users controllers are used to define the controllers for the users.
*/

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser } from './users.interface';
import { RequestLoggerService } from '../config/config.service';

/*
UsersController is a controller that provides the users functionality for the application.
*/
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly requestLogger: RequestLoggerService,
  ) {}

  /*
  create_user_account is a method that creates a new user account.
  */
  @Post('create')
  create_user_account(@Body() user: IUser) {
    this.requestLogger.log("Creating user account", "UsersController");
    return this.usersService.create_user_account(user);
  }

  /*
  get_all_users is a method that returns all users.
  */
  @Get('all')
  get_all_users() {
    this.requestLogger.log("Getting all users", "UsersController");
    return this.usersService.get_all_users();
  }

  /*
  get_user_by_id is a method that returns a user by id.
  */
  @Get(':id')
  get_user_by_id(@Param('id') id: number) {
    this.requestLogger.log("Getting user by id", "UsersController");
    return this.usersService.get_user_by_id(id);
  }
}
