/**
 * Database Module
 * Provides database configuration and connection management
 */

import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { DatabaseModuleOptions } from './interfaces/database-module.interface';

@Module({})
export class DatabaseModule {
  /**
   * Creates the database module with configuration
   */
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            const environment = process.env.NODE_ENV || 'local';
            const isDev =
              environment === 'development' || environment === 'local';

            const config = {
              type: 'sqlite' as const,
              database: `data/blog-engine-${environment}.db`,
              autoLoadEntities: true,
              synchronize: isDev,
              logging: isDev,
              entities: options.entities ? [...options.entities] : [],
            };

            return config;
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
