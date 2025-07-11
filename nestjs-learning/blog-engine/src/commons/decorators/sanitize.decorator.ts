import { Transform } from 'class-transformer';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Strips HTML tags and potentially dangerous characters
 */
export function SanitizeHtml() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }
    
    // Remove HTML tags and decode HTML entities
    return value
      .replace(/<[^>]*>/g, '')           // Remove HTML tags
      .replace(/&[#\w]+;/g, '')          // Remove HTML entities
      .replace(/javascript:/gi, '')      // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '')        // Remove event handlers (onclick, etc.)
      .trim();
  });
}
