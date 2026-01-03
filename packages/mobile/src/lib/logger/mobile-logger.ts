/**
 * Mobile Logger Implementation
 *
 * Implements ILogger interface for React Native/Expo environments
 * Uses console for logging (can be extended with React Native logging libraries)
 */

import type { ILogger } from '@rare-find/shared';

/**
 * Mobile implementation of ILogger
 * Uses console for all log levels
 * Can be extended to integrate with React Native logging services (e.g., Sentry, Bugsnag)
 */
export class MobileLogger implements ILogger {
  private readonly isDevelopment = __DEV__;

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.log(`🔍 [DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.log(`ℹ️ [INFO] ${message}`, context || '');
    } else {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`⚠️ [WARN] ${message}`, context || '');
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    console.error(`❌ [ERROR] ${message}`, context || '');
    // TODO: Integrate with error tracking service (e.g., Sentry React Native)
    // if (this.isProduction) {
    //   Sentry.captureException(new Error(message), { extra: context });
    // }
  }
}

/**
 * Create a mobile logger instance
 */
export function createMobileLogger(): MobileLogger {
  return new MobileLogger();
}
