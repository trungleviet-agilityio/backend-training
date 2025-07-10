export interface IConfigService {
  getDatabaseConfig(): DatabaseConfig;
  getAppConfig(): AppConfig;
  getJwtConfig(): JwtConfig;
  getEnvironment(): string;
}

export interface DatabaseConfig {
  type: 'mysql' | 'postgres' | 'sqlite'; // Note: 'postgresql' -> 'postgres'
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface AppConfig {
  port: number;
  name: string;
  version: string;
  environment: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}
