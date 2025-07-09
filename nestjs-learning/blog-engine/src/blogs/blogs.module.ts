/*
Blogs module is used to define the module for the blogs.
*/

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { SharedModule } from '../shared/shared.module';
import { RequestLoggerService } from '../config/config.service';
import { ValidationMiddleware } from '../middleware/validation.middleware';

/*
BlogsModule is a module that provides the blogs functionality for the application.
*/
@Module({
    imports: [SharedModule],
    controllers: [BlogsController],
    providers: [BlogsService, RequestLoggerService],
    exports: [BlogsService],
})
export class BlogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidationMiddleware)
      .forRoutes('*'); // This applies to all routes in this module
  }
}
