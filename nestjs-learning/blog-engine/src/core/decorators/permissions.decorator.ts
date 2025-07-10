/*
Permissions decorator is used to define the permissions decorator for the application.
*/

import { SetMetadata } from '@nestjs/common';

/*
Permissions decorator is a decorator that provides the permissions functionality for the application.
*/
export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

/*
Public decorator is a decorator that provides the public functionality for the application.
*/
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
