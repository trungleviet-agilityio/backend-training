import { Injectable } from '@nestjs/common';
import { IAuth, IAuthResponse } from './auths.interface';
import { InvalidCredentialsException, UserAlreadyExistsException, UserNotFoundException } from '../core/exceptions';

/*
AuthsService is a service that provides the auths functionality for the application.
*/
@Injectable()
export class AuthsService {
  private readonly auths: IAuth[] = [];

  /*
  register is a method that registers a new user.
  */
  register(auth: IAuth): IAuthResponse {
    // Check if user already exists
    const existingUser = this.auths.find((user) => user.username === auth.username);
    if (existingUser) {
      throw new UserAlreadyExistsException(auth.username);
    }

    // Validate input
    if (!auth.username || auth.username.trim() === '') {
      throw new InvalidCredentialsException();
    }

    if (!auth.password || auth.password.trim() === '') {
      throw new InvalidCredentialsException();
    }

    this.auths.push({
      username: auth.username.trim(),
      password: auth.password.trim(),
    });

    return { token: '1234567890' };
  }

  /*
  login is a method that logs in a user.
  */
  login(auth: IAuth): IAuthResponse {
    const user = this.auths.find((user) => user.username === auth.username);
    if (!user) {
      throw new UserNotFoundException(auth.username);
    }

    if (user.password !== auth.password) {
      throw new InvalidCredentialsException(auth.username);
    }

    return { token: '1234567890' };
  }
}
