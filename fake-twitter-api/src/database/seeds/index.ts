/**
 * This file contains the seeds for the database.
 */

import { DataSource } from 'typeorm';
import { seedRoles } from './role.seed';
import { runTestSeeds } from './test-seed';

export const runSeeds = async (dataSource: DataSource) => {
  await seedRoles(dataSource);

  // Run test-specific seeds only in test environment
  if (process.env.NODE_ENV === 'test') {
    await runTestSeeds(dataSource);
  }

  console.log('Database seeded successfully');
};
