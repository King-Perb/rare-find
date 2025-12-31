# Sentry Setup

Sentry has been integrated into the application for production error tracking.

## Environment Variables

To enable Sentry, you need to set the following environment variables:

### Required for Production

```bash
# Server-side DSN (for API routes and server components)
SENTRY_DSN=your-sentry-dsn-here

# Client-side DSN (for browser/client components)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here

# Sentry organization and project (for source map uploads)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
```

### Getting Your DSN

1. Sign up for a free account at [sentry.io](https://sentry.io)
2. Create a new project (select "Next.js" as the platform)
3. Copy the DSN from the project settings
4. Use the same DSN for both `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`

## How It Works

- **Development**: Errors are logged to the console with emojis (Sentry is disabled)
- **Production**: Errors are automatically sent to Sentry when `logger.error()` or `logError()` is called
  - **Note**: Sentry only initializes if DSN environment variables are configured
  - If DSN is missing, Sentry won't initialize and the app will run normally without error tracking
- **Only Errors**: Only error-level logs are sent to Sentry (not info, debug, or warn)

## Usage

The logger automatically integrates with Sentry. No code changes needed:

```typescript
import { logger } from '@/lib/logger';

// This will send to Sentry in production
logger.error('Something went wrong', { userId: '123', action: 'purchase' });
```

Or use the error logging utility:

```typescript
import { logError } from '@/lib/errors';

try {
  // some code
} catch (error) {
  logError(error, { context: 'additional info' });
}
```

## Testing

Sentry is automatically disabled in test environments. The logger will fall back to console output if Sentry is not available.
