/*
Validation related exceptions
*/

import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { IValidationDetails } from '../../commons/interfaces/common.interface';

/*
ValidationException is thrown when input validation fails
*/
export class ValidationException extends BaseException {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly error = 'Validation Error';

  constructor(message: string = 'Validation failed', details?: IValidationDetails) {
    super(message, details);
  }
}

/*
InvalidInputException is thrown when input data is invalid
*/
export class InvalidInputException extends BaseException {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly error = 'Invalid Input';

  constructor(message: string, details?: IValidationDetails) {
    super(message, details);
  }
}

/*
MissingRequiredFieldException is thrown when a required field is missing
*/
export class MissingRequiredFieldException extends BaseException {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly error = 'Missing Required Field';

  constructor(fieldName: string) {
    super(
      `Required field '${fieldName}' is missing`,
      { fieldName },
    );
  }
}

/*
InvalidDataTypeException is thrown when data type is invalid
*/
export class InvalidDataTypeException extends BaseException {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly error = 'Invalid Data Type';

  constructor(fieldName: string, expectedType: string, actualType: string) {
    super(
      `Field '${fieldName}' expected ${expectedType} but received ${actualType}`,
      { fieldName, expectedType, actualType },
    );
  }
}

/*
FieldLengthException is thrown when field length exceeds limits
*/
export class FieldLengthException extends BaseException {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly error = 'Field Length Exceeded';

  constructor(fieldName: string, maxLength: number, actualLength: number) {
    super(
      `Field '${fieldName}' exceeds maximum length of ${maxLength} (actual: ${actualLength})`,
      { fieldName, maxLength, actualLength },
    );
  }
}
