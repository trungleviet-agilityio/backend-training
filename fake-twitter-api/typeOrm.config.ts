/**
 * This file is used to configure the TypeORM database connection.
 * It is used to create the database connection and the data source.
**/

import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
if (nodeEnv === 'test') {
  config({ path: '.env.test' });
} else {
  config({ path: '.env' });
}

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/database/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false for migrations
  logging: nodeEnv === 'development',
});
