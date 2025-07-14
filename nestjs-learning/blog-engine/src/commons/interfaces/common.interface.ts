/**
 * Common Interfaces
 * Shared interfaces used across the application for type safety
 */

import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

// Re-export base interfaces
export {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

/**
 * Extended Express Request with user context
 */
export interface IRequest extends ExpressRequest {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions?: string[];
    [key: string]: any;
  };
  requestId?: string;
}

/**
 * Extended Express Response with additional context
 */
export interface IResponse extends ExpressResponse {
  requestId?: string;
}

/**
 * Error object interface for consistent error handling
 */
export interface IError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

/**
 * API Response format interface
 */
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
  requestId?: string;
}

/**
 * JWT Payload interface
 */
export interface IJwtPayload {
  sub: string;
  id: string;
  email: string;
  username?: string;
  role: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Validation details interface
 */
export interface IValidationDetails {
  field?: string;
  value?: unknown;
  message?: string;
  code?: string;
  constraints?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Pagination interface
 */
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response interface
 */
export interface IPaginatedResponse<T = any> {
  data: T[];
  pagination: IPagination;
}

/**
 * Base filter interface
 */
export interface IBaseFilter {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

/**
 * Database configuration interface
 */
export interface IDatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgres';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
}

/**
 * Cache service interface
 */
export interface ICacheService {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  getStatistics(): {
    hitRate: number;
    userCacheSize: number;
    totalEntries: number;
  };
}

/**
 * Audit log entry interface
 */
export interface IAuditLog {
  id: string;
  requestId: string;
  userId?: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Configuration service provider interface
 */
export interface IConfigServiceProvider {
  useClass: any;
  provide: string | symbol;
}

/**
 * User context interface
 */
export interface IUserContext {
  requestId: string;
  userId?: string;
  isAuthenticated: boolean;
  requestMetadata: {
    path: string;
    method: string;
    timestamp: Date;
    userAgent?: string;
    ipAddress?: string;
  };
}
