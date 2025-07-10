import { EnvironmentConfig } from '../interfaces/environment.interface';
import {
  baseEnvironmentConfig,
  mergeEnvironmentConfig,
} from './base.environment';

const localOverrides: Partial<EnvironmentConfig> = {
  name: 'local',
  port: 3000,
  database: {
    type: 'sqlite',
    database: './data/blog-engine-local.db',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
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
