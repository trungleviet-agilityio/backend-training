import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { BaseConfigService } from './base-config.service';

@Injectable()
export class DevelopmentConfigService extends BaseConfigService {
  constructor(configService: NestConfigService) {
    super(configService);
  }

  getDatabaseConfig() {
    return {
      type: 'sqlite' as const,
      host: 'localhost',
      port: 3306,
      username: 'dev_user',
      password: 'dev_password',
      database: './data/blog-engine-dev.db',
      synchronize: true, // Enable in development
      logging: true, // Enable logging in development
    };
  }

  getAppConfig() {
    return {
      port: 3000,
      name: 'Blog Engine - Development',
      version: '1.0.0',
      environment: 'development',
    };
  }

  getJwtConfig() {
    return {
      secret: 'dev-secret-key',
      expiresIn: '1h',
    };
  }

  getEnvironment(): string {
    return 'development';
  }
}
