/**
 * Response type definitions for the entire application
 * This file defines all possible response data types to avoid using 'any'
 */

// Import common DTOs that might be used in responses
import { PaginatedResponseDto } from '../dto/pagination.dto';

// Base response data types
export type EmptyResponseData = null;

// Auth-related response data types
export interface AuthTokensWithUser {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: {
    uuid: string;
    username: string;
    firstName?: string;
    lastName?: string;
    role: {
      name: string;
    };
  };
}

// Post-related response data types

// Comment-related response data types

// User-related response data types

export interface AuthRefreshTokens {
  access_token: string;
  refresh_token: string;
}

// Common response data union type - All possible response data types
export type CommonResponseData =
  | EmptyResponseData
  | AuthTokensWithUser
  | AuthRefreshTokens
  | PaginatedResponseDto<unknown>
  | Record<string, unknown> // For simple objects
  | Array<unknown> // For arrays
  | string // For simple string responses
  | number // For simple number responses
  | boolean; // For simple boolean responses

// Standard API Response Interface with proper typing
export interface ApiResponse<T = CommonResponseData> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Error response interface
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
  timestamp: string;
  path: string;
}

// Helper type for specific response types
export type AuthLoginResponse = ApiResponse<AuthTokensWithUser>;
export type AuthRegisterResponse = ApiResponse<AuthTokensWithUser>;
export type AuthRefreshResponse = ApiResponse<AuthRefreshTokens>;
export type AuthLogoutResponse = ApiResponse<EmptyResponseData>;

// Generic pagination response types
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponseDto<T>>;

// Message-only response type
export type MessageOnlyResponse = ApiResponse<EmptyResponseData>;
