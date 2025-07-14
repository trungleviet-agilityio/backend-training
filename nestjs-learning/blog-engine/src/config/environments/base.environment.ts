import { EnvironmentConfig } from '../interfaces/environment.interface';

export const baseEnvironmentConfig: Partial<EnvironmentConfig> = {
  database: {
    type: 'sqlite',
    host: 'localhost',
    port: 3306,
    username: 'user',
    password: 'password',
    database: './data/blog-engine.db',
    synchronize: true,
    logging: true,
  },
  cors: {
    origin: ['*'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  },
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: false,
  },
};

export const mergeEnvironmentConfig = (
  base: Partial<EnvironmentConfig>,
  overrides: Partial<EnvironmentConfig>,
): EnvironmentConfig => {
  return {
    ...base,
    ...overrides,
    database: {
      ...base.database,
      ...overrides.database,
    },
    cors: {
      ...base.cors,
      ...overrides.cors,
    },
    logging: {
      ...base.logging,
      ...overrides.logging,
    },
  } as EnvironmentConfig;
};
