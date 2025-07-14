/**
 * Request Context Interfaces
 * Defines types for request-scoped services and context management
 */

export interface IRequestContext {
  getRequestId(): string;
  setUserId(userId: string): void;
  getUserId(): string | undefined;
  setMetadata(key: string, value: any): void;
  getMetadata(key: string): any;
  getAllMetadata(): Map<string, any>;
  clear(): void;
}

export interface IAuditEntry {
  operation: string;
  resourceId: string;
  userId?: string;
  requestId: string;
  timestamp: Date;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface IAuditService {
  recordOperation(operation: string, resourceId: string, details?: any): void;
  recordCreate(resourceType: string, resourceId: string, data?: any): void;
  recordUpdate(resourceType: string, resourceId: string, changes?: any): void;
  recordDelete(resourceType: string, resourceId: string): void;
  recordAccess(resourceType: string, resourceId: string, details?: any): void;
  getAuditEntries(): IAuditEntry[];
  flushAuditLog(): Promise<void>;
}

export interface IUserSpecificCache {
  set(key: string, value: any, ttl?: number): void;
  get(key: string): any;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
  size(): number;
}

export interface RequestMetadata {
  timestamp: Date;
  path: string;
  method: string;
  userAgent?: string;
  ipAddress?: string;
  correlationId?: string;
}
