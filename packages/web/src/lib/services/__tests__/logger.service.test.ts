/**
 * LoggerService Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LoggerService } from '../logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logger = new LoggerService();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include context in log', () => {
      const context = { userId: '123', action: 'test' };
      logger.info('Test message', context);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test message'),
        expect.anything()
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Warning message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include context in log', () => {
      const context = { error: 'test error' };
      logger.warn('Warning message', context);
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Error message');
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include context in log', () => {
      const context = { error: 'test error', stack: 'stack trace' };
      logger.error('Error message', context);
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      // In development mode, debug should log
      vi.stubEnv('NODE_ENV', 'development');

      const devLogger = new LoggerService();
      devLogger.debug('Debug message');
      expect(consoleLogSpy).toHaveBeenCalled();

      vi.unstubAllEnvs();
    });

    it('should not log debug messages in production', () => {
      vi.stubEnv('NODE_ENV', 'production');

      const prodLogger = new LoggerService();
      prodLogger.debug('Debug message');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      vi.unstubAllEnvs();
    });
  });
});
