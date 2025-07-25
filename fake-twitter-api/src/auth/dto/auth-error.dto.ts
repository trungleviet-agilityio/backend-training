/**
 * Simplified Auth Error DTOs
 */

import {
  ConflictResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
} from '../../common/dto';

export class AuthInvalidCredentialsError extends UnauthorizedResponse {
  constructor() {
    super('Invalid email or password');
  }
}

export class AuthUserAlreadyExistsError extends ConflictResponse {
  constructor(field: 'email' | 'username', value: string) {
    super(`User with this ${field} '${value}' already exists`);
  }
}

export class AuthInvalidTokenError extends UnauthorizedResponse {
  constructor(tokenType: 'access' | 'refresh' | 'reset' = 'access') {
    super(`Invalid or expired ${tokenType} token`);
  }
}

export class AuthPasswordResetTokenExpiredError extends UnauthorizedResponse {
  constructor() {
    super('Password reset token has expired. Please request a new one.');
  }
}

export class AuthWeakPasswordError extends ValidationErrorResponse {
  constructor() {
    super([
      'Password must be at least 8 characters long',
      'Password must contain uppercase, lowercase, number and special character',
    ]);
  }
}
