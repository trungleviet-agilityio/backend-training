/*
Users module is used to define the module for the users.
*/

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SharedModule } from '../shared/shared.module';

/*
UsersModule is a module that provides the users functionality for the application.
*/
@Module({
  imports: [SharedModule],  // Import other modules that are needed for the users module
  controllers: [UsersController],  // This is used to provide the users controller to be used in the users module
  providers: [UsersService],  // This is used to provide the users service to be used in the users controller
  exports: [UsersService],  // This is used to export the users service to be used in other modules
})
export class UsersModule {}
