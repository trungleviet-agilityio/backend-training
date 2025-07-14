import { EnvironmentConfig } from '../interfaces/environment.interface';
import { localEnvironmentConfig } from './local.environment';
import { developmentEnvironmentConfig } from './development.environment';
import { productionEnvironmentConfig } from './production.environment';
import { mergeEnvironmentConfig } from './base.environment';

export const createEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || 'local';

  const envOverrides: Partial<EnvironmentConfig> = {
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    database: {
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'blog_engine',
      synchronize: process.env.DB_SYNC === 'true',
      logging: process.env.DB_LOGGING === 'true',
    },
    cors: {
      origin: process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',')
        : ['*'],
      credentials: process.env.CORS_CREDENTIALS !== 'false',
      methods: process.env.CORS_METHODS
        ? process.env.CORS_METHODS.split(',')
        : ['GET', 'POST', 'PUT', 'DELETE'],
    },
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      enableConsole: process.env.LOG_CONSOLE !== 'false',
      enableFile: process.env.LOG_FILE === 'true',
    },
  };

  let baseConfig: EnvironmentConfig;
  switch (nodeEnv) {
    case 'development':
      baseConfig = developmentEnvironmentConfig;
      break;
    case 'production':
      baseConfig = productionEnvironmentConfig;
      break;
    default:
      baseConfig = localEnvironmentConfig;
  }

  return mergeEnvironmentConfig(baseConfig, envOverrides);
};
