/*
Auths module is used to define the module for the auths.
*/

import { Module } from '@nestjs/common';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { SharedModule } from '../shared/shared.module';
import { RequestLoggerService } from '../config/config.service';

/*
AuthsModule is a module that provides the auths functionality for the application.
*/
@Module({
  imports: [SharedModule],
  controllers: [AuthsController],
  providers: [AuthsService, RequestLoggerService],
  exports: [AuthsService],
})

export class AuthsModule {}
