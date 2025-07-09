/*
App service is used to define the service for the application.
*/

import { Injectable } from '@nestjs/common';

/*
AppService is a service that provides the app functionality for the application.
*/
@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Blog Engine API! 🚀';
  }

  getInfo(): { name: string; version: string; description: string } {
    return {
      name: 'Blog Engine API',
      version: '1.0.0',
      description: 'A NestJS blog engine with Observer pattern implementation',
    };
  }
}
