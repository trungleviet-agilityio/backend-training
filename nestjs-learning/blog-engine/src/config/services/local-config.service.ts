import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { BaseConfigService } from './base-config.service';
import { localEnvironmentConfig } from '../environments/local.environment';

@Injectable()
export class LocalConfigService extends BaseConfigService {
  constructor(configService: NestConfigService) {
    super(configService);
  }

  getEnvironmentConfig() {
    return localEnvironmentConfig;
  }

  getDatabaseConfig() {
    return localEnvironmentConfig.database;
  }

  getAppConfig() {
    return {
      port: localEnvironmentConfig.port,
      name: 'Blog Engine - Local',
      version: '1.0.0',
      environment: localEnvironmentConfig.name,
    };
  }

  getJwtConfig() {
    return {
      secret: 'local-secret-key',
      expiresIn: '7d',
    };
  }

  getEnvironment(): string {
    return localEnvironmentConfig.name;
  }
}
