/**
 * User Specific Cache Service
 * Provides request-scoped caching functionality that is specific to the current user
 * Each request gets its own cache instance, preventing data leakage between users
 */

import { Injectable, Scope } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { IUserSpecificCache } from '../interfaces/request-context.interface';
import { CustomLoggerService } from '../../../core/logger/custom-logger.service';

interface CacheEntry {
  value: any;
  expiry: number | null;
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

@Injectable({ scope: Scope.REQUEST })
export class UserSpecificCacheService implements IUserSpecificCache {
  private readonly logger: CustomLoggerService;
  private readonly cache = new Map<string, CacheEntry>();
  private readonly maxSize: number = 100; // Prevent memory leaks
  private hitCount: number = 0;
  private missCount: number = 0;

  constructor(
    private readonly requestContext: RequestContextService,
    logger: CustomLoggerService,
  ) {
    this.logger = logger;
    this.logger.setContext('UserSpecificCacheService');

    this.logger.debug('🗄️ Cache instance created', {
      requestId: this.requestContext.getRequestId(),
      component: 'CACHE',
      action: 'CREATE',
      metadata: {
        maxSize: this.maxSize,
        userId: this.requestContext.getUserId() || 'anonymous',
      },
    });
  }

  /**
   * Set a value in the cache with optional TTL
   */
  set(key: string, value: any, ttl?: number): void {
    // Create user-specific key
    const userKey = this.createUserKey(key);

    // Check cache size limit
    if (this.cache.size >= this.maxSize && !this.cache.has(userKey)) {
      this.evictOldestEntry();
    }

    const entry: CacheEntry = {
      value,
      expiry: ttl ? Date.now() + ttl : null,
      createdAt: new Date(),
      accessCount: 0,
      lastAccessed: new Date(),
    };

    this.cache.set(userKey, entry);

    this.logger.debug(`💾 Cache SET: ${key}`, {
      requestId: this.requestContext.getRequestId(),
      userId: this.requestContext.getUserId(),
      component: 'CACHE',
      action: 'SET',
      metadata: {
        key: userKey,
        ttl,
        cacheSize: this.cache.size,
        hasExpiry: ttl !== undefined,
      },
    });
  }

  /**
   * Get a value from the cache
   */
  get(key: string): any {
    const userKey = this.createUserKey(key);
    const entry = this.cache.get(userKey);

    if (!entry) {
      this.missCount++;
      this.logger.debug(`❌ Cache MISS: ${key}`, {
        requestId: this.requestContext.getRequestId(),
        component: 'CACHE',
        action: 'MISS',
        metadata: {
          key: userKey,
          missCount: this.missCount,
          totalRequests: this.hitCount + this.missCount,
        },
      });
      return null;
    }

    // Check if entry has expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(userKey);
      this.missCount++;
      this.logger.debug(`⏰ Cache EXPIRED: ${key}`, {
        requestId: this.requestContext.getRequestId(),
        component: 'CACHE',
        action: 'EXPIRED',
        metadata: {
          key: userKey,
          expiredAt: new Date(entry.expiry).toISOString(),
          ageMs: Date.now() - entry.createdAt.getTime(),
        },
      });
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = new Date();
    this.hitCount++;

    this.logger.debug(`✅ Cache HIT: ${key}`, {
      requestId: this.requestContext.getRequestId(),
      component: 'CACHE',
      action: 'HIT',
      metadata: {
        key: userKey,
        accessCount: entry.accessCount,
        hitCount: this.hitCount,
        hitRate:
          ((this.hitCount / (this.hitCount + this.missCount)) * 100).toFixed(
            1,
          ) + '%',
      },
    });

    return entry.value;
  }

  /**
   * Check if a key exists in the cache
   */
  has(key: string): boolean {
    const userKey = this.createUserKey(key);
    const entry = this.cache.get(userKey);

    if (!entry) {
      return false;
    }

    // Check if expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(userKey);
      return false;
    }

    return true;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    const userKey = this.createUserKey(key);
    const result = this.cache.delete(userKey);

    if (result) {
      this.logger.debug(`Cache DELETE: ${key}`, {
        requestId: this.requestContext.getRequestId(),
        component: 'CACHE',
        action: 'DELETE',
        metadata: {
          key: userKey,
          cacheSize: this.cache.size,
        },
      });
    }

    return result;
  }

  /**
   * Clear all cache entries for this user
   */
  clear(): void {
    const userPrefix = this.getUserPrefix();
    const keysToDelete: string[] = [];

    // Find all keys belonging to this user
    this.cache.forEach((_, key) => {
      if (key.startsWith(userPrefix)) {
        keysToDelete.push(key);
      }
    });

    // Delete all user keys
    keysToDelete.forEach((key) => this.cache.delete(key));

    this.logger.debug(`Cache CLEAR: Removed ${keysToDelete.length} entries`, {
      requestId: this.requestContext.getRequestId(),
      userId: this.requestContext.getUserId(),
    });
  }

  /**
   * Get the current cache size for this user
   */
  size(): number {
    const userPrefix = this.getUserPrefix();
    let count = 0;

    this.cache.forEach((_, key) => {
      if (key.startsWith(userPrefix)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Get cache statistics
   */
  getStatistics(): {
    hitCount: number;
    missCount: number;
    hitRate: number;
    userCacheSize: number;
    totalCacheSize: number;
    entries: Array<{
      key: string;
      createdAt: Date;
      accessCount: number;
      lastAccessed: Date;
      hasExpiry: boolean;
    }>;
  } {
    const userPrefix = this.getUserPrefix();
    const entries: any[] = [];

    this.cache.forEach((entry, key) => {
      if (key.startsWith(userPrefix)) {
        entries.push({
          key: key.replace(userPrefix, ''), // Remove user prefix for display
          createdAt: entry.createdAt,
          accessCount: entry.accessCount,
          lastAccessed: entry.lastAccessed,
          hasExpiry: entry.expiry !== null,
        });
      }
    });

    const totalRequests = this.hitCount + this.missCount;
    const hitRate =
      totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0;

    return {
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: Number(hitRate.toFixed(2)),
      userCacheSize: entries.length,
      totalCacheSize: this.cache.size,
      entries,
    };
  }

  /**
   * Set multiple values at once
   */
  setMultiple(entries: Record<string, any>, ttl?: number): void {
    Object.entries(entries).forEach(([key, value]) => {
      this.set(key, value, ttl);
    });
  }

  /**
   * Get multiple values at once
   */
  getMultiple(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};

    keys.forEach((key) => {
      const value = this.get(key);
      if (value !== null) {
        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Clean up expired entries
   */
  cleanupExpired(): number {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.expiry && now > entry.expiry) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach((key) => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      this.logger.debug(
        `Cache CLEANUP: Removed ${expiredKeys.length} expired entries`,
        {
          requestId: this.requestContext.getRequestId(),
        },
      );
    }

    return expiredKeys.length;
  }

  /**
   * Create a user-specific cache key
   */
  private createUserKey(key: string): string {
    return `${this.getUserPrefix()}${key}`;
  }

  /**
   * Get the user prefix for cache keys
   */
  private getUserPrefix(): string {
    const userId = this.requestContext.getUserId();
    return `user:${userId || 'anonymous'}:`;
  }

  /**
   * Evict the oldest entry when cache is full
   */
  private evictOldestEntry(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.createdAt.getTime() < oldestTime) {
        oldestTime = entry.createdAt.getTime();
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.logger.debug(`Cache EVICT: Removed oldest entry ${oldestKey}`, {
        requestId: this.requestContext.getRequestId(),
      });
    }
  }

  /**
   * Get cache entries for this user (for debugging)
   */
  getUserEntries(): Array<{
    key: string;
    value: any;
    metadata: Omit<CacheEntry, 'value'>;
  }> {
    const userPrefix = this.getUserPrefix();
    const entries: any[] = [];

    this.cache.forEach((entry, key) => {
      if (key.startsWith(userPrefix)) {
        entries.push({
          key: key.replace(userPrefix, ''),
          value: entry.value,
          metadata: {
            expiry: entry.expiry,
            createdAt: entry.createdAt,
            accessCount: entry.accessCount,
            lastAccessed: entry.lastAccessed,
          },
        });
      }
    });

    return entries;
  }
}
