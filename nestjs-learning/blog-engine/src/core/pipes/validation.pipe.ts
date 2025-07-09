/*
ValidationPipe is a pipe that provides the validation functionality for the application.
*/
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  /*
  transform is a method that provides the validation functionality for the application.
  */
  transform(value: any, metadata: ArgumentMetadata) {
    // Check if value exists
    if (value === undefined || value === null) {
      throw new BadRequestException('Value is required');
    }

    // Check if value is empty string
    if (typeof value === 'string' && value.trim() === '') {
      throw new BadRequestException('Value cannot be empty');
    }

    // Check if value is an object and has required properties
    if (metadata.type === 'body' && typeof value === 'object') {
      this.validateObject(value);
    }

    return value;
  }

  /*
  validateObject is a method that provides the validation functionality for the application.
  */
  private validateObject(obj: any) {
    // TODO: Add your custom validation logic here
    // For example, check required fields, data types, etc.

    if (obj.title && typeof obj.title !== 'string') {
      throw new BadRequestException('Title must be a string');
    }

    if (obj.content && typeof obj.content !== 'string') {
      throw new BadRequestException('Content must be a string');
    }

    if (obj.title && obj.title.length > 100) {
      throw new BadRequestException('Title must be less than 100 characters');
    }
  }
}
