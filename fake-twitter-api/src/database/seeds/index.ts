/**
 * This file contains the seeds for the database.
 */

import { DataSource } from 'typeorm';
import { seedRoles } from './role.seed';

export const runSeeds = async (dataSource: DataSource) => {
  await seedRoles(dataSource);
  console.log('Database seeded successfully');
};
