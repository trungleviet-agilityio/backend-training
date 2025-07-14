/**
 * Database Module
 * Provides PostgreSQL database configuration and connection management
 */

import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { DatabaseModuleOptions } from './interfaces/database-module.interface';
import { getTypeOrmConfig } from '../config/database.config';

@Module({})
export class DatabaseModule {
  /**
   * Creates the database module with PostgreSQL configuration
   */
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            const config = getTypeOrmConfig();
            
            return {
              ...config,
              entities: options.entities ? [...options.entities] : [],
            };
          },
        }),
      ],
      providers: [
        DatabaseService,
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
      ],
      exports: [DatabaseService, TypeOrmModule],
      global: true,
    };
  }

  /**
   * Creates the feature module for entities
   */
  static forFeature(entities: any[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forFeature(entities)],
      exports: [TypeOrmModule],
    };
  }
}
