/**
 * This file contains the decorator to set custom response messages.
 */

import { SetMetadata } from '@nestjs/common';
import { RESPONSE_MESSAGE_METADATA } from '../interceptors/response.interceptor';

/**
 * Decorator to set custom response messages.
 * @param message - The message to set.
 * @returns The decorator function.
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA, message);
