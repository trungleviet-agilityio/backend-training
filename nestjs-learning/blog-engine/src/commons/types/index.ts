/**
 * Types barrel export file
 */

// Application specific types can be added here
export type DatabaseType = 'sqlite' | 'mysql' | 'postgres';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type SortOrder = 'ASC' | 'DESC';
export type UserRole = 'admin' | 'user' | 'moderator';
export type BlogStatus = 'draft' | 'published' | 'archived';
export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';
