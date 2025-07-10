import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigController } from './config.controller';
import { ConfigService, RequestLoggerService } from './config.service';
import { SharedModule } from '../shared/shared.module';
import { configServiceProvider } from './providers/config.provider';
import { ConfigModuleOptions } from './interfaces/config-module.interface';
import { CONFIG_SERVICE, CONFIG_OPTIONS } from '../commons/constants/tokens';

@Module({})
export class ConfigModule {
  /**
   * forRoot() - Configure dynamic module once and reuse configuration in multiple places
   * This is used for global configuration setup
   */
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            `.env.${process.env.NODE_ENV || 'local'}`,
            '.env.local',
            '.env',
            ...(options.envFiles || []),
          ],
          load: options.load || [],
          cache: options.cache !== false,
          expandVariables: options.expandVariables !== false,
          validationSchema: options.validationSchema,
          validationOptions: options.validationOptions,
        }),
        SharedModule,
      ],
      controllers: [ConfigController],
      providers: [
        ConfigService,
        configServiceProvider,
        RequestLoggerService,
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [CONFIG_SERVICE, ConfigService, CONFIG_OPTIONS],
      global: options.isGlobal !== false,
    };
  }

  /**
   * forFeature() - Use configuration from forRoot but modify for specific needs
   * Used when you need specific configuration for a particular module
   */
  static forFeature(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forFeature(() => ({
          ...options,
        })),
      ],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
      ],
      exports: [CONFIG_OPTIONS],
    };
  }
}
