export interface EnvironmentConfig {
  name: string;
  port: number;
  database: DatabaseEnvironmentConfig;
  redis?: RedisEnvironmentConfig;
  cors: CorsEnvironmentConfig;
  logging: LoggingEnvironmentConfig;
}

export interface DatabaseEnvironmentConfig {
  type: 'mysql' | 'postgres' | 'sqlite';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface RedisEnvironmentConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface CorsEnvironmentConfig {
  origin: string | string[];
  credentials: boolean;
  methods: string[];
}

export interface LoggingEnvironmentConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  enableConsole: boolean;
  enableFile: boolean;
}
