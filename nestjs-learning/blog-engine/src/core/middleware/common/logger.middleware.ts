/*
Logger middleware is used to define the middleware for the logger.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../../logger/custom-logger.service';

/*
LoggerMiddleware is a middleware that provides the logger functionality for the application.
*/
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.setContext('LoggerMiddleware');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.logRequestEnd(
        req.method,
        req.url,
        res.statusCode,
        duration,
        req['requestId'] || 'unknown',
        {
          component: 'MIDDLEWARE',
          metadata: {
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.connection.remoteAddress,
          },
        },
      );
    });

    next();
  }
}
