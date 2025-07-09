/*
Config module is used to define the module for the config.
*/

import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService, RequestLoggerService } from './config.service';
import { SharedModule } from '../shared/shared.module';

/*
ConfigModule is a module that provides the config functionality for the application.
*/
@Module({
    imports: [SharedModule],
    controllers: [ConfigController],
    providers: [ConfigService, RequestLoggerService],
    exports: [ConfigService],
})
export class ConfigModule {}
