/**
 * Database Configuration
 * Provides PostgreSQL database configuration for different environments
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  autoLoadEntities: boolean;
  retryAttempts: number;
  retryDelay: number;
  maxQueryExecutionTime: number;
  dropSchema?: boolean;
}

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  const environment = process.env.NODE_ENV || 'local';
  
  const baseConfig: DatabaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'blog_engine_dev',
    autoLoadEntities: true,
    retryAttempts: 3,
    retryDelay: 3000,
    maxQueryExecutionTime: 10000,
    synchronize: false,
    logging: false,
  };

  // Environment-specific configurations
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        port: 5434,
        database: 'blog_engine_dev',
        synchronize: true,
        logging: true,
      };

    case 'test':
      return {
        ...baseConfig,
        port: 5435,
        database: 'blog_engine_test',
        synchronize: true,
        logging: false,
        dropSchema: true,
        retryAttempts: 1,
        retryDelay: 1000,
      };

    case 'local':
      return {
        ...baseConfig,
        port: 5434,
        database: 'blog_engine_dev',
        synchronize: true,
        logging: true,
      };

    case 'production':
      return {
        ...baseConfig,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        synchronize: false,
        logging: false,
        retryAttempts: 5,
        retryDelay: 5000,
      };

    default:
      return baseConfig;
  }
}

/**
 * Get TypeORM configuration options
 */
export function getTypeOrmConfig(): TypeOrmModuleOptions {
  const dbConfig = getDatabaseConfig();
  
  return {
    ...dbConfig,
    entities: [], // Will be auto-loaded
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  } as TypeOrmModuleOptions;
}

/**
 * Database health check configuration
 */
export const databaseHealthConfig = {
  timeout: 5000,
  retries: 3,
  retryDelay: 1000,
}; 