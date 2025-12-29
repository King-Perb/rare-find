/**
 * Error handling utilities
 * 
 * Centralized error handling and logging infrastructure
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', { retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : 'UnknownError',
    ...context,
  };

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with error tracking service
    console.error('Error:', errorInfo);
  } else {
    console.error('Error:', errorInfo);
  }
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
  if (typeof error === 'object' && error !== null) {
    // Check for direct message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    // Check for error property (string)
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
    
    // Check for nested error object with message
    if ('error' in error && typeof error.error === 'object' && error.error !== null) {
      const nestedError = error.error as Record<string, unknown>;
      if ('message' in nestedError && typeof nestedError.message === 'string') {
        return nestedError.message;
      }
    }
  }
  
  // Fallback: return generic message instead of "[object Object]"
  return 'An error occurred. Please try again.';
}

/**
 * Format error for API response
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
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'An internal error occurred' : error.message,
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

