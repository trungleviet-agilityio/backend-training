/**
 * Configuration Providers
 * Provides environment-specific configuration services and factory functions
 */

import { createEnvironmentConfig } from '../environments/environment.factory';
import { DevelopmentConfigService } from '../services/development-config.service';
import { LocalConfigService } from '../services/local-config.service';
import { ProductionConfigService } from '../services/production-config.service';
import { CONFIG_SERVICE } from '../../commons/constants/tokens';

export const configServiceProvider = {
  provide: CONFIG_SERVICE,
  useClass:
    process.env.NODE_ENV === 'production'
      ? ProductionConfigService
      : process.env.NODE_ENV === 'development'
        ? DevelopmentConfigService
        : LocalConfigService,
};

export const environmentConfigProvider = {
  provide: 'ENVIRONMENT_CONFIG',
  useFactory: () => createEnvironmentConfig(),
};
