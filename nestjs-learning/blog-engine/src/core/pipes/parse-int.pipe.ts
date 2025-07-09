/*
ParseInt pipe is used to define the parse int pipe for the application.
*/

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/*
ParseIntPipe is a pipe that provides the parse int functionality for the application.
*/
@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Check if value exists
    if (value === undefined || value === null) {
      throw new BadRequestException('Value is required');
    }

    // Convert to number
    const parsedValue = parseInt(value, 10);

    // Check if the conversion was successful
    if (isNaN(parsedValue)) {
      throw new BadRequestException('Value must be a valid integer');
    }

    // Check if the value is positive (for IDs)
    if (parsedValue <= 0) {
      throw new BadRequestException('Value must be a positive integer');
    }

    return parsedValue;
  }
}
