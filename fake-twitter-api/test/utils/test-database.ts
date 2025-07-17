/**
 * Test database module
 */

import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_TEST_HOST,
  port: Number(process.env.DB_TEST_PORT),
  username: process.env.DB_TEST_USER,
  password: process.env.DB_TEST_PASSWORD,
  database: process.env.DB_TEST_NAME,
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
