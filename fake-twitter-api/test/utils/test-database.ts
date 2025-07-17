/**
 * Test Database Module
 * Provides TypeORM configuration for test databases
 */

import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
});

/**
 * Test user creation
 */
export const createTestUser = async (app: INestApplication) => {
  // Helper to create test user
};

export const getAuthToken = async (app: INestApplication, credentials: any) => {
  // Helper to get auth token
};
