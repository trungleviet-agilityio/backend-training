/**
 * This file contains the current user decorator.
 */

import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IJwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IJwtPayload;
  },
);
