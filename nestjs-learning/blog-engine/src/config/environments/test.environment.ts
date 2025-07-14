import { EnvironmentConfig } from '../interfaces/environment.interface';
import {
  baseEnvironmentConfig,
  mergeEnvironmentConfig,
} from './base.environment';

const testOverrides: Partial<EnvironmentConfig> = {
  name: 'test',
  port: 3001,
  database: {
    type: 'postgres',
    database: 'blog_engine_test',
    host: 'localhost',
    port: 5435,
    username: 'postgres',
    password: 'postgres',
    synchronize: true,
    logging: false,
  },
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  logging: {
    level: 'error',
    enableConsole: false,
    enableFile: false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 1, // Use different Redis database for tests
  },
};

export const testEnvironmentConfig: EnvironmentConfig = mergeEnvironmentConfig(
  baseEnvironmentConfig,
  testOverrides,
); 