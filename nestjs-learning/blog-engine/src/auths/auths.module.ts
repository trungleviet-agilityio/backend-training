/*
Auths module is used to define the module for the auths.
*/

import { Module } from '@nestjs/common';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { SharedModule } from '../shared/shared.module';
import { RequestLoggerService } from '../config/config.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from '../core/guards';

/*
AuthsModule is a module that provides the auths functionality for the application.
*/
@Module({
  imports: [SharedModule],
  controllers: [AuthsController],
  providers: [
		AuthsService,
		RequestLoggerService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
  exports: [AuthsService],
})

export class AuthsModule {}
