import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
UserPayload is an interface that defines the user payload for the application.
*/
export interface UserPayload {
    id: number;
    username: string;
    role: string;
    permissions?: string[];
    email?: string;
    createdAt?: Date;
  }

/*
CurrentUser decorator extracts the authenticated user from the request.
*/
export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext): UserPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
