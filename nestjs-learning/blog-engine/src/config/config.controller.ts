/*
Config controller is used to define the controller for the config.
*/

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

/*
ConfigController is a controller that provides the config functionality for the application.
*/
@Controller('config')
export class ConfigController {
    constructor(private readonly configService: ConfigService) {}  // This is used to inject the config service into the config controller

    @Get()
    getConfig() {
        return this.configService.getConfig();
    }
}
