/*
Authentication and authorization related exceptions
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { IValidationDetails } from '../../commons/interfaces/common.interface';

/*
AuthenticationException is thrown when user authentication fails
*/
export class AuthenticationException extends BaseException {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly error = 'Authentication Error';

  constructor(message: string = 'Authentication failed', details?: IValidationDetails) {
    super(message, details);
  }
}

/*
AuthorizationException is thrown when user authorization fails
*/
export class AuthorizationException extends BaseException {
  readonly statusCode = HttpStatus.FORBIDDEN;
  readonly error = 'Authorization Error';

  constructor(message: string = 'Access denied', details?: IValidationDetails) {
    super(message, details);
  }
}

/*
InvalidCredentialsException is thrown when user provides invalid credentials
*/
export class InvalidCredentialsException extends BaseException {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly error = 'Invalid Credentials';

  constructor(message: string = 'Invalid username or password', username?: string) {
    super(message, username ? { username } : undefined);
  }
}

/*
TokenExpiredException is thrown when JWT token has expired
*/
export class TokenExpiredException extends BaseException {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly error = 'Token Expired';

  constructor(message: string = 'Token has expired') {
    super(message);
  }
}

/*
InvalidTokenException is thrown when JWT token is invalid
*/
export class InvalidTokenException extends BaseException {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly error = 'Invalid Token';

  constructor(message: string = 'Invalid token provided') {
    super(message);
  }
}

/*
MissingTokenException is thrown when no JWT token is provided
*/
export class MissingTokenException extends BaseException {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly error = 'Missing Token';

  constructor(message: string = 'No token provided') {
    super(message);
  }
}

/*
UserNotFoundException is thrown when user is not found
*/
export class UserNotFoundException extends BaseException {
  readonly statusCode = HttpStatus.NOT_FOUND;
  readonly error = 'User Not Found';

  constructor(message: string = 'User not found', username?: string) {
    super(message, username ? { username } : undefined);
  }
}

/*
UserAlreadyExistsException is thrown when trying to create a user that already exists
*/
export class UserAlreadyExistsException extends BaseException {
  readonly statusCode = HttpStatus.CONFLICT;
  readonly error = 'User Already Exists';

  constructor(message: string = 'User already exists', username: string) {
    super(message, { username });
  }
}
