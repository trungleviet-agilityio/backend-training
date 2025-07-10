import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { BaseConfigService } from './base-config.service';

@Injectable()
export class ProductionConfigService extends BaseConfigService {
  constructor(configService: NestConfigService) {
    super(configService);
  }

  getDatabaseConfig() {
    return {
      type: 'mysql' as const,
      host: this.configService.get('DB_HOST') || 'localhost',
      port: parseInt(this.configService.get('DB_PORT') || '3306'),
      username: this.configService.get('DB_USERNAME') || 'root',
      password: this.configService.get('DB_PASSWORD') || '',
      database: this.configService.get('DB_DATABASE') || 'blog_engine',
      synchronize: false, // Disable in production
      logging: false, // Disable logging in production
    };
  }

  getAppConfig() {
    return {
      port: parseInt(this.configService.get('PORT') || '3000'),
      name: 'Blog Engine - Production',
      version: '1.0.0',
      environment: 'production',
    };
  }

  getJwtConfig() {
    return {
      secret: this.configService.get('JWT_SECRET') || 'production-secret-key',
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
    };
  }

  getEnvironment(): string {
    return 'production';
  }
}
