/*
Error handler middleware is used to define the middleware for the error handler.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/*
ErrorHandlerMiddleware is a middleware that provides the error handler functionality for the application.
*/
@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
      const originalSend = res.send;

      res.send = function(data) {
      if (res.statusCode >= 400) {
          console.error(`Error ${res.statusCode}: ${req.method} ${req.url}`);
      }
      return originalSend.call(this, data);
      };

      next();
  }
}
