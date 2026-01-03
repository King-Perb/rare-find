# Quickstart: Extract Business Logic to Shared Package

**Feature**: 004-extract-business-logic
**Date**: 2026-01-02

## Overview

This guide provides a quick reference for developers working on extracting business logic from the web package to the shared package, and for mobile developers who will consume the shared package.

## For Developers Extracting Code

### Step 1: Identify Code to Extract

Look for business logic in `packages/web/src/lib/`:
- ✅ Marketplace services and clients
- ✅ Evaluation services and prompts
- ✅ Listing services
- ✅ Rate limiter
- ✅ Error classes (platform-agnostic version)
- ✅ Service interfaces
- ❌ Platform-specific code (Supabase, Prisma, Sentry)

### Step 2: Create Platform Abstractions

For code that uses platform-specific APIs:

1. **Crypto Operations**: Create `ICryptoProvider` interface
   ```typescript
   interface ICryptoProvider {
     sha256(data: string): string;
     hmacSha256(key: string | Buffer, data: string): Buffer;
   }
   ```

2. **HTTP Requests**: Create `IHttpClient` interface
   ```typescript
   interface IHttpClient {
     fetch(url: string, options?: RequestInit): Promise<Response>;
   }
   ```

3. **Logging**: Use existing `ILogger` interface

### Step 3: Extract to Shared Package

1. Copy files to `packages/shared/src/lib/[category]/`
2. Remove platform-specific dependencies
3. Add dependency injection for platform-specific code
4. Update imports to use shared package types

### Step 4: Update Web Package

1. Create platform-specific implementations:
   - `packages/web/src/lib/crypto/node-crypto-provider.ts`
   - `packages/web/src/lib/logger/web-logger.ts` (can keep existing)
2. Update imports to use shared package
3. Inject platform-specific dependencies

### Step 5: Add Tests

1. Migrate existing tests to `packages/shared/__tests__/`
2. Mock platform-specific dependencies
3. Ensure test coverage remains at 80%+

## For Mobile Developers

### Step 1: Install Dependencies

```bash
cd packages/mobile
npm install expo-crypto  # or react-native-crypto
```

### Step 2: Create Platform Implementations

Create platform-specific providers:

**`packages/mobile/src/lib/crypto/expo-crypto-provider.ts`**:
```typescript
import * as Crypto from 'expo-crypto';
import { ICryptoProvider } from '@rare-find/shared/lib/interfaces';

export class ExpoCryptoProvider implements ICryptoProvider {
  async sha256(data: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data
    );
  }

  async hmacSha256(key: string, data: string): Promise<Buffer> {
    // Implementation using expo-crypto
  }
}
```

**`packages/mobile/src/lib/logger/mobile-logger.ts`**:
```typescript
import { ILogger } from '@rare-find/shared/lib/interfaces';

export class MobileLogger implements ILogger {
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(`[DEBUG] ${message}`, context);
  }
  // ... other methods
}
```

### Step 3: Use Shared Services

```typescript
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services';
import { ExpoCryptoProvider } from '@/lib/crypto/expo-crypto-provider';
import { MobileLogger } from '@/lib/logger/mobile-logger';

// Create service with mobile-specific dependencies
const marketplaceService = new MarketplaceService(
  new MobileLogger(),
  new ExpoCryptoProvider(),
  fetch // React Native fetch
);

// Use the service
const listing = await marketplaceService.fetchListingFromUrl(url);
```

## Common Patterns

### Dependency Injection Pattern

```typescript
// Shared package (platform-agnostic)
export class MarketplaceService {
  constructor(
    private logger: ILogger,
    private crypto: ICryptoProvider,
    private http: IHttpClient
  ) {}
}

// Web package (platform-specific)
const service = new MarketplaceService(
  webLogger,
  nodeCryptoProvider,
  fetch
);

// Mobile package (platform-specific)
const service = new MarketplaceService(
  mobileLogger,
  expoCryptoProvider,
  fetch
);
```

### Error Handling Pattern

```typescript
// Shared package
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

// Platform packages can wrap for error tracking
try {
  await service.validateListing(listing);
} catch (error) {
  if (error instanceof ValidationError) {
    // Platform-specific error tracking (Sentry, etc.)
    trackError(error);
    throw error;
  }
}
```

## Testing

### Shared Package Tests

```typescript
// packages/shared/__tests__/marketplace/service.test.ts
import { MarketplaceService } from '../lib/marketplace/services';
import { createMockLogger, createMockCrypto, createMockHttp } from './mocks';

describe('MarketplaceService', () => {
  it('should parse Amazon URL', () => {
    const service = new MarketplaceService(
      createMockLogger(),
      createMockCrypto(),
      createMockHttp()
    );
    // Test implementation
  });
});
```

### Platform Package Tests

```typescript
// packages/mobile/__tests__/marketplace.test.ts
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services';
import { ExpoCryptoProvider } from '@/lib/crypto/expo-crypto-provider';

describe('MarketplaceService (Mobile)', () => {
  it('should work with mobile crypto provider', () => {
    const service = new MarketplaceService(
      mockLogger,
      new ExpoCryptoProvider(),
      mockFetch
    );
    // Test implementation
  });
});
```

## Troubleshooting

### TypeScript Errors

**Error**: `Cannot find module '@rare-find/shared'`

**Solution**: Ensure TypeScript project references are configured:
```json
// packages/mobile/tsconfig.json
{
  "references": [
    { "path": "../shared" }
  ]
}
```

### Crypto Provider Issues

**Error**: `Crypto operations not working in React Native`

**Solution**:
- Use `expo-crypto` for Expo projects
- Use `react-native-crypto` for bare React Native projects
- Ensure polyfills are not needed (use native implementations)

### Import Path Issues

**Error**: `Module not found` when importing from shared

**Solution**: Check package.json exports:
```json
// packages/shared/package.json
{
  "exports": {
    ".": "./src/index.ts",
    "./lib/*": "./src/lib/*",
    "./types/*": "./src/types/*"
  }
}
```

## Next Steps

1. Review [data-model.md](./data-model.md) for entity definitions
2. Review [contracts/README.md](./contracts/README.md) for interface contracts
3. Review [research.md](./research.md) for implementation decisions
4. See [tasks.md](./tasks.md) for detailed implementation tasks
