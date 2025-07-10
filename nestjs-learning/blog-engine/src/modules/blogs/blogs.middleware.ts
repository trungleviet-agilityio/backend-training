/*
Blog rate limit middleware is used to define the middleware for the blog rate limit.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/*
BlogRateLimitMiddleware is a middleware that provides the blog rate limit functionality for the application.
*/
@Injectable()
export class BlogRateLimitMiddleware implements NestMiddleware {
  private requestCounts = new Map<string, number>();

  use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.ip || 'unknown'; // TODO: Implement client id
    const currentCount = this.requestCounts.get(clientId) || 0;

    if (currentCount > 100) {
      // 100 requests per minute
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    this.requestCounts.set(clientId, currentCount + 1);

    // Reset counter after 1 minute
    setTimeout(() => {
      this.requestCounts.set(clientId, Math.max(0, currentCount - 1));
    }, 60000);

    next();
  }
}
