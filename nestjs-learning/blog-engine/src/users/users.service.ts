/*
Users service is used to define the service for the users.
*/

import { Injectable } from '@nestjs/common';
import { IUser } from './users.interface';

/*
UsersService is a service that provides the users functionality for the application.
*/
@Injectable()
export class UsersService {
  private readonly users: IUser[] = [];

  /*
  create is a method that creates a new user.
  */
  create_user_account(user: IUser) {
    this.users.push(user);
    return user;    // This is used to return the user that was created
  }

  /*
  get_all_users is a method that returns all users.
  */
  get_all_users() {
    return this.users;  // This is used to return all users
  }

  /*
  get_user_by_id is a method that returns a user by id.
  */
  get_user_by_id(id: number) {
    return this.users.find((user) => user.id === id);  // This is used to return a user by id
  }
}
