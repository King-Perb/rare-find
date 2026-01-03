/**
 * Error Classes Tests
 *
 * Tests for platform-agnostic error classes used across web and mobile
 */

import { describe, it, expect } from 'vitest';
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
} from '../src/lib/errors';

describe('Error Classes', () => {
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

    it('should be an instance of Error', () => {
      const error = new AppError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
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

    it('should be an instance of AppError', () => {
      const error = new ValidationError('Invalid input');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
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

    it('should be an instance of AppError', () => {
      const error = new NotFoundError('User');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
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

    it('should be an instance of AppError', () => {
      const error = new UnauthorizedError();
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(UnauthorizedError);
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

    it('should be an instance of AppError', () => {
      const error = new RateLimitError();
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(RateLimitError);
    });
  });
});
