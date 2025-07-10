import { EnvironmentConfig } from '../interfaces/environment.interface';
import { baseEnvironmentConfig } from './base.environment';

export const developmentEnvironmentConfig: EnvironmentConfig = {
  name: 'development',
  port: 8000,
  database: {
    type: 'sqlite',
    host: 'localhost',
    port: 3306,
    username: 'dev_user',
    password: 'dev_password',
    database: './data/blog-engine-dev.db',
    synchronize: true,
    logging: true,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  cors: {
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    credentials: baseEnvironmentConfig.cors?.credentials ?? true,
    methods: baseEnvironmentConfig.cors?.methods ?? [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ],
  },
  logging: {
    level: 'debug',
    enableConsole: true,
    enableFile: baseEnvironmentConfig.logging?.enableFile ?? false,
  },
};
