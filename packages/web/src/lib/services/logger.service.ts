/**
 * Logger Service Implementation
 *
 * Implements ILogger interface for centralized logging
 */

import type { ILogger } from './interfaces';

export class LoggerService implements ILogger {
  private readonly isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to logging service (e.g., LogRocket, Datadog)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with logging service
      console.log(JSON.stringify(logEntry));
    } else {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, context || '');
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
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
