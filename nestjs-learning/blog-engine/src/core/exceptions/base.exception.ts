/*
Base exception is used to define the base exception for the application.
*/

import { HttpException, HttpStatus } from '@nestjs/common';
import { IValidationDetails } from '../../shared/interfaces/validation-details.interface';

/*
BaseException is a base exception that provides the base exception functionality for the application.
*/
export abstract class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode?: string,
    public readonly details?: IValidationDetails,
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }

  /*
  getErrorCode is a method that returns the error code.
  */
  getErrorCode(): string | undefined {
    return this.errorCode;
  }

  /*
  getDetails is a method that returns the details.
  */
  getDetails(): IValidationDetails | undefined {
    return this.details;
  }
}
