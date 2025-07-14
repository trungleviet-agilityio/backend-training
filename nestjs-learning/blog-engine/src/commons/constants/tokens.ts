/**
 * Injection Tokens Constants
 * This file contains all the string tokens used for dependency injection
 * to avoid typos and improve maintainability
 */

// Config Module Tokens
export const CONFIG_SERVICE = 'IConfigService';
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

// Database Module Tokens
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const DATABASE_OPTIONS = 'DATABASE_OPTIONS';
export const DATABASE_FEATURE_OPTIONS = 'DATABASE_FEATURE_OPTIONS';

// Repository Tokens
export const BLOG_REPOSITORY = 'BLOG_REPOSITORY';
export const USER_REPOSITORY = 'USER_REPOSITORY';

// Auth Module Tokens
export const AUTH_OPTIONS = 'AUTH_OPTIONS';

// Users Module Tokens
export const USERS_OPTIONS = 'USERS_OPTIONS';
export const USERS_CACHE = 'USERS_CACHE';

// Blogs Module Tokens
export const BLOGS_OPTIONS = 'BLOGS_OPTIONS';
export const BLOGS_CACHE = 'BLOGS_CACHE';
export const BLOGS_SEARCH_SERVICE = 'BLOGS_SEARCH_SERVICE';

// Logger Tokens
export const LOGGER_CONFIG = 'LOGGER_CONFIG';
export const REQUEST_LOGGER = 'REQUEST_LOGGER';

// Cache Tokens
export const REDIS_CLIENT = 'REDIS_CLIENT';
export const CACHE_MANAGER = 'CACHE_MANAGER';

// External Services Tokens
export const EMAIL_SERVICE = 'EMAIL_SERVICE';
export const FILE_UPLOAD_SERVICE = 'FILE_UPLOAD_SERVICE';
export const NOTIFICATION_SERVICE = 'NOTIFICATION_SERVICE';
