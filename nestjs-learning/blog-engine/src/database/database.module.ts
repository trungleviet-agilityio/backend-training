/*
Database module is used to define the module for the database.
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

/*
DatabaseModule is a module that provides the database functionality for the application.
*/
@Module({
  imports: [TypeOrmModule.forRoot()],  // This is used to import the typeorm module
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
