import { Injectable } from '@nestjs/common';
import { IAuth, IAuthResponse } from './auths.interface';

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
    this.auths.push(auth);
    return { token: '1234567890' };
  }

  /*
  login is a method that logs in a user.
  */
  login(auth: IAuth): IAuthResponse {
    const user = this.auths.find((user) => user.username === auth.username);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== auth.password) {
      throw new Error('Invalid password');
    }
    return { token: '1234567890' };
  }
}
