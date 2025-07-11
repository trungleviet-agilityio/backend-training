/*
Base exception classes provide the foundation for all custom exceptions.
These are used to maintain consistency in error handling across the application.
*/

import { IValidationDetails } from '../../commons/interfaces/common.interface';

/*
BaseException is used as the base class for all custom exceptions.
*/
export abstract class BaseException extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly error: string;
  public readonly timestamp: string;
  public details?: IValidationDetails;

  constructor(
    message: string,
    details?: IValidationDetails,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.details = details;

    // Capture stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      error: this.error,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack,
    };
  }
}
