/*
Auth middleware is used to define the middleware for the auth.
*/

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/*
AuthMiddleware is a middleware that provides the auth functionality for the application.
*/
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // TODO: Implement JWT token validation
    // TODO: Implement user authentication
    // TODO: Implement user authorization
    // TODO: Implement user role based access control
    // TODO: Implement user permission based access control
    // TODO: Implement user session management
    // TODO: Implement user session timeout
    // TODO: Implement user session refresh
    next();
  }
}
