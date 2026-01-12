/**
 * Error handling utilities
 *
 * Centralized error handling and logging infrastructure
 * Re-exports shared error classes and adds web-specific utilities (Sentry integration)
 */

import * as Sentry from '@sentry/nextjs';

// Re-export error classes from shared package
export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
} from '@rare-find/shared/lib/errors';

// Import AppError for use in this file
import { AppError } from '@rare-find/shared/lib/errors';

/**
 * Log error with context
 * Sends errors to Sentry in production
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : 'UnknownError',
    ...context,
  };

  // Non-production: log to console (development, test, etc.)
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', errorInfo);
  }

  // Production: send to Sentry
  if (process.env.NODE_ENV === 'production') {
    try {
      // Capture the error with context
      if (error instanceof Error) {
        Sentry.captureException(error, {
          level: 'error',
          extra: {
            ...context,
            errorName: error.name,
          },
          tags: {
            logger: 'logError',
          },
        });
      } else {
        // For non-Error types, create an Error object
        const errorMessage = typeof error === 'string' ? error : String(error);
        Sentry.captureException(new Error(errorMessage), {
          level: 'error',
          extra: {
            ...context,
            originalError: error,
            errorName: 'UnknownError',
          },
          tags: {
            logger: 'logError',
          },
        });
      }
    } catch {
      // Sentry not available (e.g., in test environment) - fallback to console
      console.error('Error:', errorInfo);
    }
  }
}

/**
 * Extract message from error object with message property
 */
function extractMessageFromObject(error: Record<string, unknown>): string | null {
  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return null;
}

/**
 * Extract message from nested error object
 */
function extractNestedErrorMessage(error: Record<string, unknown>): string | null {
  if ('error' in error && typeof error.error === 'object' && error.error !== null) {
    const nestedError = error.error as Record<string, unknown>;
    if ('message' in nestedError && typeof nestedError.message === 'string') {
      return nestedError.message;
    }
  }
  return null;
}

/**
 * Extract user-friendly error message from various error types
 *
 * Handles:
 * - String errors (returns as-is)
 * - Error objects (extracts message)
 * - AppError instances (extracts message)
 * - Error objects with message/error properties
 * - Unknown types (returns generic message)
 *
 * @param error - Error of any type
 * @returns User-friendly error message string, or null if no error
 */
export function getErrorMessage(error: string | null | Error | Record<string, unknown>): string | null {
  if (!error) return null;

  // String errors
  if (typeof error === 'string') return error;

  // Error instances (including AppError and subclasses)
  if (error instanceof Error) return error.message;

  // Error objects with message/error properties
  // After checking for string, null, and Error, remaining type is Record<string, unknown>
  if (typeof error === 'object' && error !== null) {
    // Check for direct message property
    const directMessage = extractMessageFromObject(error);
    if (directMessage) return directMessage;

    // Check for error property (string)
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }

    // Check for nested error object with message
    const nestedMessage = extractNestedErrorMessage(error);
    if (nestedMessage) return nestedMessage;
  }

  // Fallback: return generic message instead of "[object Object]"
  return 'An error occurred. Please try again.';
}

/**
 * Format error for API response
 * 
 * In production, error messages are hidden unless EXPOSE_ERROR_DETAILS=true
 * In development, error messages are always shown
 */
export function formatErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message,
        details: error.details,
      },
    };
  }

  if (error instanceof Error) {
    const shouldExposeDetails =
      process.env.NODE_ENV !== 'production' ||
      process.env.EXPOSE_ERROR_DETAILS === 'true';

    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: shouldExposeDetails
          ? error.message
          : 'An internal error occurred',
      },
    };
  }

  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unknown error occurred',
    },
  };
}
