/*
Shared module is used to define the module for the shared functionality.
*/

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestLoggerService } from '../config/config.service';

/*
SharedModule is a module that provides the shared functionality for the application.
*/
@Module({
  imports: [],  // This is used to import the logger service
  providers: [
    ConfigService,
    {
        provide: "API_VERSION",
        useValue: "v1",
    },
    {
        provide: "API_NAME",
        useValue: "blog-engine",
    },
    {
        provide: "API_DESCRIPTION",
        useValue: "Blog engine is a blog engine for the application.",
    },
    RequestLoggerService,
  ],  // This is used to provide the logger service to be used in the shared module
  exports: [ConfigService, "API_VERSION", "API_NAME", "API_DESCRIPTION", RequestLoggerService],  // This is used to export the logger service to be used in other modules
})
export class SharedModule {}
