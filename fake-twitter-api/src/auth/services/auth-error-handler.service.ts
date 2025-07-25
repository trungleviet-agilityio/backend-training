/**
 * Centralized Auth Error Handler
 */

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AuthInvalidCredentialsError,
  AuthUserAlreadyExistsError,
  AuthInvalidTokenError,
  AuthWeakPasswordError,
  AuthPasswordResetTokenExpiredError,
  RegisterPayloadDto,
} from '../dto';

@Injectable()
export class AuthErrorHandler {
  handleLoginError(error: any): never {
    if (error.message?.includes('Invalid credentials')) {
      throw new UnauthorizedException(new AuthInvalidCredentialsError());
    }
    throw error;
  }

  handleRegistrationError(error: any, payload: RegisterPayloadDto): never {
    if (error.message === 'EMAIL_EXISTS') {
      throw new ConflictException(
        new AuthUserAlreadyExistsError('email', payload.email),
      );
    }
    if (error.message === 'USERNAME_EXISTS') {
      throw new ConflictException(
        new AuthUserAlreadyExistsError('username', payload.username),
      );
    }
    if (error.message?.includes('password')) {
      throw new UnprocessableEntityException(new AuthWeakPasswordError());
    }
    throw error;
  }

  handleRefreshError(error: any): never {
    throw new UnauthorizedException(new AuthInvalidTokenError('refresh'));
  }

  handleLogoutError(error: any): never {
    throw error;
  }

  handlePasswordResetError(error: any): never {
    if (error.message?.includes('Invalid or expired reset token')) {
      throw new UnauthorizedException(new AuthPasswordResetTokenExpiredError());
    }
    if (
      error.message?.includes('password') ||
      error.message?.includes('Password')
    ) {
      throw new UnprocessableEntityException(new AuthWeakPasswordError());
    }
    throw error;
  }
}
