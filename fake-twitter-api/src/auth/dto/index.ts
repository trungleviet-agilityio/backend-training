/**
 * This file contains the DTOs for the auth.
 */

// Data transfer DTOs (for request/response data)
export * from './auth.dto';

// Request payload DTOs
export * from './login.dto';
export * from './register.dto';
export * from './reset-password.dto';
export * from './refresh-token.dto';
export * from './forgot-password.dto';
export * from './logout.dto';

// Auth-specific error DTOs
export * from './auth-error.dto';
