/**
 * Custom ParseInt Pipe
 * Validates and transforms string values to integers
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, _metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    if (isNaN(val)) {
      throw new BadRequestException(
        `Expected integer value, received: ${JSON.stringify(value)}`,
      );
    }

    return val;
  }
}
