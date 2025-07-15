/**
 * This file contains the script to seed the database.
 */

import { DataSource } from 'typeorm';
import { runSeeds } from '.';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5436'),
  username: process.env.DB_USERNAME || 'fake_twitter_user',
  password: process.env.DB_PASSWORD || 'fake_twitter_password',
  database: process.env.DB_DATABASE || 'fake_twitter_db',
  entities: ['src/database/entities/*.entity.ts'],
  synchronize: false,
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    await runSeeds(AppDataSource);

    await AppDataSource.destroy();
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
