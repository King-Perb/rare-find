/**
 * Logging infrastructure
 * 
 * Centralized logging utilities for API interactions and application events
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
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

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

// Legacy export - use LoggerService from DI container for new code
// This maintains backward compatibility
import { container, ServiceKeys } from './di/container';
import type { ILogger } from './services/interfaces';

// Ensure DI is initialized (setup.ts auto-initializes on import)
import './di/setup';

// Get logger from DI container
export const logger = container.resolve<ILogger>(ServiceKeys.Logger);

/**
 * Log API request
 */
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  metadata?: LogContext
) {
  logger.info(`API Request: ${method} ${path}`, {
    method,
    path,
    userId,
    ...metadata,
  });
}

/**
 * Log API response
 */
export function logApiResponse(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  logger.info(`API Response: ${method} ${path} ${statusCode}`, {
    method,
    path,
    statusCode,
    duration: `${duration}ms`,
    userId,
  });
}

/**
 * Log marketplace API call
 */
export function logMarketplaceCall(
  marketplace: 'amazon' | 'ebay',
  endpoint: string,
  success: boolean,
  duration: number,
  metadata?: LogContext
) {
  logger.info(`Marketplace API: ${marketplace} ${endpoint}`, {
    marketplace,
    endpoint,
    success,
    duration: `${duration}ms`,
    ...metadata,
  });
}

/**
 * Log AI evaluation
 */
export function logAIEvaluation(
  listingId: string,
  success: boolean,
  duration: number,
  metadata?: LogContext
) {
  logger.info(`AI Evaluation: ${listingId}`, {
    listingId,
    success,
    duration: `${duration}ms`,
    ...metadata,
  });
}

