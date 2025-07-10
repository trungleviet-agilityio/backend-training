/**
 * Custom Transform Pipe
 * Generic pipe for data transformation
 */

import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TransformPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    // Add any transformation logic here if needed
    return value;
  }
}
