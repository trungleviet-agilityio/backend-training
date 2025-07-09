/*
Config service is used to define the service for the config.
*/

import { Injectable, Scope } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

/*
ConfigService is a service that provides the config functionality for the application.
*/
@Injectable()
export class ConfigService {
    constructor(private readonly configService: NestConfigService) {}  // This is used to inject the config service into the config service

    /*
    get is a method that returns the config value for the given key. If the key is not found, it will return undefined.
    */
    get(key: string): string | undefined {
        return this.configService.get(key) as string | undefined;
    }  // This is used to return the config value for the given key

    /*
    getConfig is a method that returns the config object for the application.
    */
    getConfig() {
        return {
            version: this.get("API_VERSION"),
            name: this.get("API_NAME"),
            description: this.get("API_DESCRIPTION"),
            author: this.get("API_AUTHOR"),
            license: this.get("API_LICENSE"),
        }
    }
}


@Injectable({ scope: Scope.REQUEST })
export class RequestLoggerService {
    private requestId: string;

    constructor() {
        this.requestId = uuidv4();
    }

    log(message: string, context: string = "Request") {
        console.log(`[${this.requestId}] ${context} - ${message}`);
    }
}
