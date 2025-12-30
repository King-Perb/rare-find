/**
 * Sentry Client Configuration
 *
 * Configures Sentry for client-side error tracking
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only send errors in production when DSN is configured
  enabled: process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // Set sample rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,

  // Environment
  environment: process.env.NODE_ENV || 'development',

  // Only capture errors, not all logs
  beforeSend(event, _hint) {
    // Only send errors in production
    if (process.env.NODE_ENV !== 'production') {
      return null;
    }

    // Only send error-level events
    if (event.level !== 'error' && event.level !== 'fatal') {
      return null;
    }

    return event;
  },
});
