import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequest } from '../../../commons/interfaces/common.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequest>();
    return request.user;
  },
);
