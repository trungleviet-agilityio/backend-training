/**
 * Database Service
 * Provides database connection and health check functionality
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CustomLoggerService } from '../core/logger/custom-logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: CustomLoggerService;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    logger: CustomLoggerService,
  ) {
    this.logger = logger;
    this.logger.setContext('DatabaseService');
  }

  onModuleInit(): void {
    try {
      if (this.dataSource.isInitialized) {
        this.logger.debug('💾 Database service initialized');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        '❌ Failed to initialize database service:',
        errorMessage,
      );
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
        this.logger.log('🔌 Database connection closed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(
        '❌ Failed to close database connection:',
        errorMessage,
      );
    }
  }

  /**
   * Check database connection health
   */
  isHealthy(): boolean {
    try {
      return this.dataSource.isInitialized;
    } catch {
      return false;
    }
  }

  /**
   * Get database statistics
   */
  getStatistics(): {
    isInitialized: boolean;
    databaseType: string;
    hasConnection: boolean;
  } {
    return {
      isInitialized: this.dataSource.isInitialized,
      databaseType: this.dataSource.options.type,
      hasConnection: this.dataSource.isInitialized,
    };
  }

  /**
   * Execute raw query (use with caution)
   */
  async query(sql: string, parameters?: any[]): Promise<any> {
    return this.dataSource.query(sql, parameters);
  }
}
