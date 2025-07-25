/**
 * Auth Test Fixtures
 * Provides predefined test data for auth tests with proper types
 */

import {
  IUserLoginData,
  IUserRegistrationData,
} from '../interfaces/auth.interface';

export const AuthFixtures = {
  validRegistrationData: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User',
  } as IUserRegistrationData,

  minimalRegistrationData: {
    email: 'minimal@example.com',
    username: 'minimaluser',
    password: 'SecurePass123!',
  } as IUserRegistrationData,

  validLoginData: {
    email: 'login@example.com',
    password: 'SecurePass123!',
  } as IUserLoginData,

  invalidEmails: [
    'invalid-email',
    'test@',
    '@example.com',
    'test..user@example.com',
    'test@example..com',
  ] as string[],

  weakPasswords: [
    '123', // too short
    'password', // no uppercase, no number, no special char
    'Password', // no number, no special char
    'Password1', // no special char
    'pass', // too short
    'a'.repeat(129), // too long
    'password123', // no uppercase, no special char
    'PASSWORD123', // no lowercase, no special char
    'Password123', // no special char
  ] as string[],

  invalidUsernames: [
    'ab', // too short
    'a'.repeat(21), // too long
    'test@user', // contains special characters
    'test user', // contains space
    'test-user', // contains hyphen
  ] as string[],

  expectedErrorMessages: {
    invalidEmail: 'Please provide a valid email address',
    weakPassword:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    usernameTooShort: 'Username must be at least 3 characters long',
    usernameTooLong: 'Username must not exceed 20 characters',
    usernameInvalidChars:
      'Username can only contain letters, numbers, and underscores',
    duplicateEmail: 'User with this email',
    duplicateUsername: 'User with this username',
    invalidCredentials: 'Invalid email or password',
    missingFields: 'Validation failed',
    invalidRefreshToken: 'Invalid or expired refresh token',
    invalidResetToken:
      'Password reset token has expired. Please request a new one.',
    noAuthHeader: 'No valid authorization header',
  } as const,

  expectedSuccessMessages: {
    registration: 'User registered successfully',
    login: 'User logged in successfully',
    logout: 'User logged out successfully',
    refresh: 'Token refreshed successfully',
    forgotPassword:
      'If an account with this email exists, a password reset link has been sent.',
    resetPassword: 'Password reset successfully',
  } as const,
};
