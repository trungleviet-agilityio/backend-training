/*
TransformPipe is a pipe that provides the transformation functionality for the application.
*/

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class TransformPipe implements PipeTransform {
  /*
  transform is a method that provides the transformation functionality for the application.
  */
  transform(value: unknown, metadata: ArgumentMetadata) {
    // Transform string values
    if (typeof value === 'string') {
      return this.transformString(value);
    }

    // Transform object values
    if (typeof value === 'object' && value !== null) {
      return this.transformObject(value as Record<string, unknown>);
    }

    return value;
  }

  private transformString(value: string): string {
    // Trim whitespace
    let transformed = value.trim();

    // Convert to lowercase for certain fields
    // You can add more transformation logic here

    return transformed;
  }

  private transformObject(obj: Record<string, unknown>): Record<string, unknown> {
    const transformed = { ...obj };

    // Transform string properties
    for (const [key, value] of Object.entries(transformed)) {
      if (typeof value === 'string') {
        transformed[key] = this.transformString(value);
      }
    }

    // Add default values for missing properties
    if (transformed.title && !transformed.slug) {
      transformed.slug = this.generateSlug(transformed.title as string);
    }

    return transformed;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
