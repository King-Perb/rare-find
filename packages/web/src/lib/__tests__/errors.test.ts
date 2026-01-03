/**
 * Web-Specific Error Utilities Tests
 *
 * Tests for web-specific error utilities (Sentry integration, API response formatting)
 * Error classes are tested in the shared package
 */

import { describe, it, expect, vi } from 'vitest';
import { AppError } from '@rare-find/shared/lib/errors';
import { logError, getErrorMessage, formatErrorResponse } from '../errors';

describe('Web Error Utilities', () => {
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
