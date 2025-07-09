/*
Auth exceptions are used to define the auth exceptions for the application.
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/*
AuthenticationException is an exception that provides the authentication exception functionality for the application.
*/
export class AuthenticationException extends BaseException {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      'AUTHENTICATION_FAILED',
      details
    );
  }
}

/*
AuthorizationException is an exception that provides the authorization exception functionality for the application.
*/
export class AuthorizationException extends BaseException {
  constructor(message: string, details?: any) {
    super(
      message,
      HttpStatus.FORBIDDEN,
      'AUTHORIZATION_FAILED',
      details
    );
  }
}

/*
InvalidCredentialsException is an exception that provides the invalid credentials exception functionality for the application.
*/
export class InvalidCredentialsException extends BaseException {
  constructor(username?: string) {
    super(
      'Invalid username or password',
      HttpStatus.UNAUTHORIZED,
      'INVALID_CREDENTIALS',
      username ? { username } : undefined
    );
  }
}

/*
TokenExpiredException is an exception that provides the token expired exception functionality for the application.
*/
export class TokenExpiredException extends BaseException {
  constructor() {
    super(
      'Token has expired',
      HttpStatus.UNAUTHORIZED,
      'TOKEN_EXPIRED'
    );
  }
}

/*
InvalidTokenException is an exception that provides the invalid token exception functionality for the application.
*/
export class InvalidTokenException extends BaseException {
  constructor() {
    super(
      'Invalid token provided',
      HttpStatus.UNAUTHORIZED,
      'INVALID_TOKEN'
    );
  }
}

/*
MissingTokenException is an exception that provides the missing token exception functionality for the application.
*/
export class MissingTokenException extends BaseException {
  constructor() {
    super(
      'No token provided',
      HttpStatus.UNAUTHORIZED,
      'MISSING_TOKEN'
    );
  }
}

/*
UserNotFoundException is an exception that provides the user not found exception functionality for the application.
*/
export class UserNotFoundException extends BaseException {
  constructor(username?: string) {
    super(
      'User not found',
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
      username ? { username } : undefined
    );
  }
}

/*
UserAlreadyExistsException is an exception that provides the user already exists exception functionality for the application.
*/
export class UserAlreadyExistsException extends BaseException {
  constructor(username: string) {
    super(
      `User with username '${username}' already exists`,
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
      { username }
    );
  }
}
