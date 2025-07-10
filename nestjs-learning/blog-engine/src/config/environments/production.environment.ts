import { EnvironmentConfig } from '../interfaces/environment.interface';
import {
  baseEnvironmentConfig,
  mergeEnvironmentConfig,
} from './base.environment';

const productionOverrides: Partial<EnvironmentConfig> = {
  name: 'production',
  port: 8080,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog_engine',
    synchronize: false,
    logging: false,
  },
  redis: process.env.REDIS_HOST
    ? {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      }
    : undefined,
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  logging: {
    level: 'info',
    enableFile: true,
    enableConsole: true,
  },
};

export const productionEnvironmentConfig: EnvironmentConfig =
  mergeEnvironmentConfig(baseEnvironmentConfig, productionOverrides);
