/*
Decorators index is used to export all decorators for the application.
*/

// Role decorators (all in one file)
export { Admin, User, Author } from './role.decorator';

// Authorization decorators
export { Permissions, Public } from './permissions.decorator';

// Parameter decorators
export { CurrentUser, UserPayload } from './current-user.decorator';
