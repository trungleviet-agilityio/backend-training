/*
Exceptions index is used to export all exceptions for the application.
*/

// Base exceptions
export { BaseException } from './base.exception';

// Validation exceptions
export {
  ValidationException,
  InvalidInputException,
  MissingRequiredFieldException,
  InvalidDataTypeException,
  FieldLengthException,
} from './validation.exceptions';

// Entity exceptions
export {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  EntityCreationException,
  EntityUpdateException,
  EntityDeletionException,
  BlogNotFoundException,
  BlogCreationException,
  BlogUpdateException,
  BlogDeletionException,
} from './entity.exceptions';

// Auth exceptions
export {
  AuthenticationException,
  AuthorizationException,
  InvalidCredentialsException,
  TokenExpiredException,
  InvalidTokenException,
  MissingTokenException,
  UserNotFoundException,
  UserAlreadyExistsException,
} from './auth.exceptions';
