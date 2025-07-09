/*
App controller is used to define the controller for the application.
*/

import { Controller, Get } from '@nestjs/common';

/*
AppController is a controller that provides the app functionality for the application.
*/
@Controller()
export class AppController {
  constructor() {}  // This is used to inject the app service into the app controller

  /*
  getHealth is a method that returns the health of the application.
  */
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
