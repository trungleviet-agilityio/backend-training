import { EnvironmentConfig } from '../interfaces/environment.interface';
import {
  baseEnvironmentConfig,
  mergeEnvironmentConfig,
} from './base.environment';

const localOverrides: Partial<EnvironmentConfig> = {
  name: 'local',
  port: 3000,
  database: {
    type: 'postgres',
    database: 'blog_engine_dev',
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: 'postgres',
    synchronize: true,
    logging: true,
  },
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableFile: false,
  },
};

export const localEnvironmentConfig: EnvironmentConfig = mergeEnvironmentConfig(
  baseEnvironmentConfig,
  localOverrides,
);
