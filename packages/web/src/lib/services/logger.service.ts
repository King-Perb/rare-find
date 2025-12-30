/**
 * Logger Service Implementation
 *
 * Implements ILogger interface for centralized logging
 * Integrates with Sentry for production error tracking
 */

import type { ILogger } from './interfaces';
import * as Sentry from '@sentry/nextjs';

export class LoggerService implements ILogger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly isProduction = process.env.NODE_ENV === 'production';

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // Non-production: nice console output with emojis (development, test, etc.)
    if (!this.isProduction) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, context || '');
    }

    // Production: send errors to Sentry
    if (this.isProduction && level === 'error') {
      // Create an error object from the message string
      const error = new Error(message);

      // Capture exception with context
      Sentry.captureException(error, {
        level: 'error',
        extra: {
          ...context,
          timestamp,
          originalMessage: message,
        },
        tags: {
          logger: 'LoggerService',
        },
      });
    }

    // Production: also log to console (structured JSON for log aggregation)
    if (this.isProduction) {
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isProduction) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }
}
