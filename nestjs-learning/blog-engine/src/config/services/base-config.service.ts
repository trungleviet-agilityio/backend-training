import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  IConfigService,
  DatabaseConfig,
  AppConfig,
  JwtConfig,
} from '../interfaces/config.interface';

@Injectable()
export abstract class BaseConfigService implements IConfigService {
  constructor(protected readonly configService: NestConfigService) {}

  abstract getDatabaseConfig(): DatabaseConfig;
  abstract getAppConfig(): AppConfig;
  abstract getJwtConfig(): JwtConfig;
  abstract getEnvironment(): string;
}
