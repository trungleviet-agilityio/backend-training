/*
Validation exceptions are used to define the validation exceptions for the application.
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { IValidationDetails } from '../../shared/interfaces/validation-details.interface';

/*
ValidationException is an exception that provides the validation exception functionality for the application.
*/
export class ValidationException extends BaseException {
  constructor(message: string, details?: IValidationDetails) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

/*
InvalidInputException is an exception that provides the invalid input exception functionality for the application.
*/
export class InvalidInputException extends BaseException {
  constructor(message: string, details?: IValidationDetails) {
    super(message, HttpStatus.BAD_REQUEST, 'INVALID_INPUT', details);
  }
}

/*
MissingRequiredFieldException is an exception that provides the missing required field exception functionality for the application.
*/
export class MissingRequiredFieldException extends BaseException {
  constructor(fieldName: string) {
    super(
      `Missing required field: ${fieldName}`,
      HttpStatus.BAD_REQUEST,
      'MISSING_REQUIRED_FIELD',
      { fieldName },
    );
  }
}

/*
InvalidDataTypeException is an exception that provides the invalid data type exception functionality for the application.
*/
export class InvalidDataTypeException extends BaseException {
  constructor(fieldName: string, expectedType: string, actualType: string) {
    super(
      `Invalid data type for field '${fieldName}'. Expected: ${expectedType}, Got: ${actualType}`,
      HttpStatus.BAD_REQUEST,
      'INVALID_DATA_TYPE',
      { fieldName, expectedType, actualType },
    );
  }
}

/*
FieldLengthException is an exception that provides the field length exception functionality for the application.
*/
export class FieldLengthException extends BaseException {
  constructor(fieldName: string, maxLength: number, actualLength: number) {
    super(
      `Field '${fieldName}' exceeds maximum length. Maximum: ${maxLength}, Actual: ${actualLength}`,
      HttpStatus.BAD_REQUEST,
      'FIELD_LENGTH_EXCEEDED',
      { fieldName, maxLength, actualLength },
    );
  }
}
