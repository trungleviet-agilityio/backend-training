/*
Entity exceptions are used to define the entity exceptions for the application.
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/*
EntityNotFoundException is an exception that provides the entity not found exception functionality for the application.
*/
export class EntityNotFoundException extends BaseException {
  constructor(entityName: string, entityId: string) {
    super(
      `${entityName} with id '${entityId}' not found`,
      HttpStatus.NOT_FOUND,
      'ENTITY_NOT_FOUND',
      { entityName, entityId }
    );
  }
}

/*
EntityAlreadyExistsException is an exception that provides the entity already exists exception functionality for the application.
*/
export class EntityAlreadyExistsException extends BaseException {
  constructor(entityName: string, fieldName: string, fieldValue: string) {
    super(
      `${entityName} with ${fieldName} '${fieldValue}' already exists`,
      HttpStatus.CONFLICT,
      'ENTITY_ALREADY_EXISTS',
      { entityName, fieldName, fieldValue }
    );
  }
}

/*
EntityCreationException is an exception that provides the entity creation exception functionality for the application.
*/
export class EntityCreationException extends BaseException {
  constructor(entityName: string, reason?: string) {
    super(
      `Failed to create ${entityName}${reason ? `: ${reason}` : ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'ENTITY_CREATION_FAILED',
      { entityName, reason }
    );
  }
}

/*
EntityUpdateException is an exception that provides the entity update exception functionality for the application.
*/
export class EntityUpdateException extends BaseException {
  constructor(entityName: string, entityId: string, reason?: string) {
    super(
      `Failed to update ${entityName} with id '${entityId}'${reason ? `: ${reason}` : ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'ENTITY_UPDATE_FAILED',
      { entityName, entityId, reason }
    );
  }
}

/*
EntityDeletionException is an exception that provides the entity deletion exception functionality for the application.
*/
export class EntityDeletionException extends BaseException {
  constructor(entityName: string, entityId: string, reason?: string) {
    super(
      `Failed to delete ${entityName} with id '${entityId}'${reason ? `: ${reason}` : ''}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'ENTITY_DELETION_FAILED',
      { entityName, entityId, reason }
    );
  }
}

/*
BlogNotFoundException is an exception that provides the blog not found exception functionality for the application.
*/
export class BlogNotFoundException extends EntityNotFoundException {
  constructor(blogId: string) {
    super('Blog', blogId);
  }
}

/*
BlogCreationException is an exception that provides the blog creation exception functionality for the application.
*/
export class BlogCreationException extends EntityCreationException {
  constructor(reason?: string) {
    super('Blog', reason);
  }
}

/*
BlogUpdateException is an exception that provides the blog update exception functionality for the application.
*/
export class BlogUpdateException extends EntityUpdateException {
  constructor(blogId: string, reason?: string) {
    super('Blog', blogId, reason);
  }
}

/*
BlogDeletionException is an exception that provides the blog deletion exception functionality for the application.
*/
export class BlogDeletionException extends EntityDeletionException {
  constructor(blogId: string, reason?: string) {
    super('Blog', blogId, reason);
  }
}
