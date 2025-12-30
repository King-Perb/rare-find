import { describe, it, expect, vi } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
  logError,
  getErrorMessage,
  formatErrorResponse,
} from '../errors';

describe('errors', () => {
  describe('AppError', () => {
    it('should create an AppError with default status code', () => {
      const error = new AppError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('AppError');
      expect(error.code).toBeUndefined();
      expect(error.details).toBeUndefined();
    });

    it('should create an AppError with custom status code', () => {
      const error = new AppError('Test error', 404);
      expect(error.statusCode).toBe(404);
    });

    it('should create an AppError with code and details', () => {
      const details = { field: 'email' };
      const error = new AppError('Test error', 400, 'TEST_CODE', details);
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual(details);
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError with correct defaults', () => {
      const error = new ValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    it('should create a ValidationError with details', () => {
      const details = { field: 'email', reason: 'invalid format' };
      const error = new ValidationError('Invalid input', details);
      expect(error.details).toEqual(details);
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError without ID', () => {
      const error = new NotFoundError('User');
      expect(error.message).toBe('User not found');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.name).toBe('NotFoundError');
    });

    it('should create a NotFoundError with ID', () => {
      const error = new NotFoundError('User', '123');
      expect(error.message).toBe('User with id 123 not found');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create an UnauthorizedError with default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.name).toBe('UnauthorizedError');
    });

    it('should create an UnauthorizedError with custom message', () => {
      const error = new UnauthorizedError('Access denied');
      expect(error.message).toBe('Access denied');
    });
  });

  describe('RateLimitError', () => {
    it('should create a RateLimitError with default message', () => {
      const error = new RateLimitError();
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.name).toBe('RateLimitError');
    });

    it('should create a RateLimitError with custom message and retryAfter', () => {
      const error = new RateLimitError('Too many requests', 60);
      expect(error.message).toBe('Too many requests');
      expect(error.details).toEqual({ retryAfter: 60 });
    });
  });

  describe('logError', () => {
    it('should log Error instance', () => {
      const error = new Error('Test error');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: 'Test error',
          name: 'Error',
          stack: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log Error instance with context', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logError(error, context);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: 'Test error',
          userId: '123',
          action: 'test',
        })
      );

      consoleSpy.mockRestore();
    });

    it('should log non-Error values', () => {
      const error = 'String error';
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      logError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.objectContaining({
          message: 'String error',
          name: 'UnknownError',
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getErrorMessage', () => {
    it('should return null for null', () => {
      expect(getErrorMessage(null)).toBeNull();
    });

    it('should return string as-is', () => {
      expect(getErrorMessage('Test error')).toBe('Test error');
    });

    it('should extract message from Error instance', () => {
      const error = new Error('Test error');
      expect(getErrorMessage(error)).toBe('Test error');
    });

    it('should extract message from AppError instance', () => {
      const error = new AppError('App error', 500);
      expect(getErrorMessage(error)).toBe('App error');
    });

    it('should extract message from object with message property', () => {
      const error = { message: 'Object error' };
      expect(getErrorMessage(error)).toBe('Object error');
    });

    it('should extract error from object with error string property', () => {
      const error = { error: 'Error string' };
      expect(getErrorMessage(error)).toBe('Error string');
    });

    it('should extract message from nested error object', () => {
      const error = { error: { message: 'Nested error' } };
      expect(getErrorMessage(error)).toBe('Nested error');
    });

    it('should return generic message for unknown error types', () => {
      const error = { someProperty: 'value' };
      expect(getErrorMessage(error)).toBe('An error occurred. Please try again.');
    });

    it('should return generic message for non-object errors', () => {
      expect(getErrorMessage(123 as unknown as Error)).toBe('An error occurred. Please try again.');
    });
  });

  describe('formatErrorResponse', () => {
    it('should format AppError response', () => {
      const error = new AppError('Test error', 400, 'TEST_CODE', { field: 'email' });
      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'TEST_CODE',
          message: 'Test error',
          details: { field: 'email' },
        },
      });
    });

    it('should format Error response in development', () => {
      vi.stubEnv('NODE_ENV', 'development');

      const error = new Error('Test error');
      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Test error',
        },
      });

      vi.unstubAllEnvs();
    });

    it('should format Error response in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const error = new Error('Test error');
      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred',
        },
      });

      vi.unstubAllEnvs();
    });

    it('should format unknown error response', () => {
      const error = 'Unknown error';
      const response = formatErrorResponse(error);

      expect(response).toEqual({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unknown error occurred',
        },
      });
    });
  });
});
