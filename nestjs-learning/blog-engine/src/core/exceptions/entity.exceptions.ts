/*
Entity related exceptions
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { IValidationDetails } from '../../commons/interfaces/common.interface';

/*
EntityNotFoundException is thrown when an entity is not found
*/
export class EntityNotFoundException extends BaseException {
  readonly statusCode = HttpStatus.NOT_FOUND;
  readonly error = 'Entity Not Found';

  constructor(entityName: string, entityId: string) {
    super(
      `${entityName} with id '${entityId}' not found`,
      { entityName, entityId },
    );
  }
}

/*
EntityAlreadyExistsException is thrown when trying to create an entity that already exists
*/
export class EntityAlreadyExistsException extends BaseException {
  readonly statusCode = HttpStatus.CONFLICT;
  readonly error = 'Entity Already Exists';

  constructor(entityName: string, fieldName: string, fieldValue: string) {
    super(
      `${entityName} with ${fieldName} '${fieldValue}' already exists`,
      { entityName, fieldName, fieldValue },
    );
  }
}

/*
EntityCreationException is thrown when entity creation fails
*/
export class EntityCreationException extends BaseException {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly error = 'Entity Creation Failed';

  constructor(entityName: string, reason?: string) {
    super(
      `Failed to create ${entityName}${reason ? ': ' + reason : ''}`,
      { entityName, reason },
    );
  }
}

/*
EntityUpdateException is thrown when entity update fails
*/
export class EntityUpdateException extends BaseException {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly error = 'Entity Update Failed';

  constructor(entityName: string, entityId: string, reason?: string) {
    super(
      `Failed to update ${entityName} with id '${entityId}'${reason ? ': ' + reason : ''}`,
      { entityName, entityId, reason },
    );
  }
}

/*
EntityDeletionException is thrown when entity deletion fails
*/
export class EntityDeletionException extends BaseException {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly error = 'Entity Deletion Failed';

  constructor(entityName: string, entityId: string, reason?: string) {
    super(
      `Failed to delete ${entityName} with id '${entityId}'${reason ? ': ' + reason : ''}`,
      { entityName, entityId, reason },
    );
  }
}

// Specific Blog Exceptions (extending generic entity exceptions)

/*
BlogNotFoundException is a specific exception for blog not found
*/
export class BlogNotFoundException extends EntityNotFoundException {
  constructor(blogId: string) {
    super('Blog', blogId);
  }
}

/*
BlogCreationException is a specific exception for blog creation failure
*/
export class BlogCreationException extends EntityCreationException {
  constructor(reason?: string) {
    super('Blog', reason);
  }
}

/*
BlogUpdateException is a specific exception for blog update failure
*/
export class BlogUpdateException extends EntityUpdateException {
  constructor(blogId: string, reason?: string) {
    super('Blog', blogId, reason);
  }
}

/*
BlogDeletionException is a specific exception for blog deletion failure
*/
export class BlogDeletionException extends EntityDeletionException {
  constructor(blogId: string, reason?: string) {
    super('Blog', blogId, reason);
  }
}
