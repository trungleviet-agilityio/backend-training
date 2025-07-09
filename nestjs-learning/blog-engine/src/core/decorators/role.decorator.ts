/*
Role decorators are used to define role-based access control decorators.
*/

import { SetMetadata } from '@nestjs/common';

// Role constants
export const ADMIN_KEY = 'admin';
export const USER_KEY = 'user';
export const AUTHOR_KEY = 'author';

// Role decorators
export const Admin = () => SetMetadata(ADMIN_KEY, true);
export const User = () => SetMetadata(USER_KEY, true);
export const Author = () => SetMetadata(AUTHOR_KEY, true);
