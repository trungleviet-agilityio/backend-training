/*
Validation middleware is used to define the middleware for the validation.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/*
ValidationMiddleware is a middleware that provides the validation functionality for the application.
*/
@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    //TODO: Implement validation middleware
    next();
  }
}
