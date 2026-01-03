# @rare-find/shared

Shared business logic and TypeScript types for the Rare Find application.

This package contains platform-agnostic code that is shared between the web application (`@rare-find/web`) and mobile application (`@rare-find/mobile`). All business logic is designed with dependency injection to support different platforms.

## Structure

```
src/
├── lib/                    # Business logic
│   ├── interfaces.ts       # Core interfaces (ILogger, ICryptoProvider, IHttpClient, etc.)
│   ├── errors.ts           # Error classes (AppError, ValidationError, etc.)
│   ├── marketplace/        # Marketplace services and clients
│   │   ├── services/      # MarketplaceService
│   │   ├── clients/       # AmazonClient, eBayClient, RapidAPIAmazonClient
│   │   ├── rate-limiter.ts # Rate limiting logic
│   │   └── types.ts       # Marketplace types
│   ├── listing/           # Listing validation and normalization
│   │   └── services/      # ListingService
│   └── evaluation/        # AI evaluation logic
│       ├── services/      # EvaluationService
│       ├── evaluate-user-listing.ts # Core evaluation function
│       ├── prompts.ts     # AI prompt templates
│       └── types.ts       # Evaluation types
├── types/                  # TypeScript type definitions
│   ├── database.ts        # Supabase Database types (generated)
│   └── index.ts           # Centralized type exports
├── scripts/                # Utility scripts
│   └── generate-supabase-types.js  # Generate Database types from Supabase
└── index.ts                # Package entry point
```

## Installation

This package is part of a Turborepo monorepo. It's automatically linked via workspace dependencies.

```bash
# In web or mobile package
npm install @rare-find/shared
```

## Usage

### Basic Imports

```typescript
// Import services
import { MarketplaceService, ListingService, EvaluationService } from '@rare-find/shared';

// Import types
import type { MarketplaceListing, EvaluationResult } from '@rare-find/shared';

// Import error classes
import { AppError, ValidationError } from '@rare-find/shared';

// Import marketplace clients
import { AmazonClient, eBayClient, RapidAPIAmazonClient } from '@rare-find/shared/lib/marketplace/clients';

// Import rate limiter
import { waitForRateLimit, getRateLimiter } from '@rare-find/shared';

// Import prompts
import { getEvaluationPrompt, PROMPT_VERSION } from '@rare-find/shared';
```

### Web Package Usage

#### 1. Create Platform-Specific Providers

```typescript
// packages/web/src/lib/crypto/node-crypto-provider.ts
import { createHash, createHmac } from 'node:crypto';
import type { ICryptoProvider } from '@rare-find/shared';

export class NodeCryptoProvider implements ICryptoProvider {
  sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  hmacSha256(key: string | Buffer, data: string): Buffer {
    return createHmac('sha256', key).update(data).digest();
  }
}
```

```typescript
// packages/web/src/lib/http/web-http-client.ts
import type { IHttpClient } from '@rare-find/shared';

export class WebHttpClient implements IHttpClient {
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
```

#### 2. Use Shared Services

```typescript
import { MarketplaceService } from '@rare-find/shared';
import { AmazonClient, eBayClient } from '@rare-find/shared/lib/marketplace/clients';
import { NodeCryptoProvider } from '@/lib/crypto/node-crypto-provider';
import { WebHttpClient } from '@/lib/http/web-http-client';
import { LoggerService } from '@/lib/services/logger.service';
import OpenAI from 'openai';

// Create platform-specific providers
const logger = new LoggerService();
const cryptoProvider = new NodeCryptoProvider();
const httpClient = new WebHttpClient();

// Create marketplace clients
const amazonClient = new AmazonClient(
  { accessKey: '...', secretKey: '...', associateTag: '...' },
  cryptoProvider,
  httpClient
);

const ebayClient = new eBayClient(
  { appId: '...' },
  httpClient
);

// Create marketplace service
const marketplaceService = new MarketplaceService(
  logger,
  amazonClient,
  ebayClient
);

// Use the service
const listing = await marketplaceService.fetchListingFromUrl(
  'https://www.amazon.com/dp/B08XYZ1234'
);
```

#### 3. Use Evaluation Service

```typescript
import { EvaluationService } from '@rare-find/shared';
import OpenAI from 'openai';

const logger = new LoggerService();
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const evaluationService = new EvaluationService(logger, openaiClient);

const result = await evaluationService.evaluateListing({
  listing: marketplaceListing,
  mode: 'multimodal',
  category: 'Electronics',
});
```

### Mobile Package Usage

#### 1. Create Platform-Specific Providers

```typescript
// packages/mobile/src/lib/crypto/expo-crypto-provider.ts
import CryptoJS from 'crypto-js';
import type { ICryptoProvider } from '@rare-find/shared';

export class ExpoCryptoProvider implements ICryptoProvider {
  sha256(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }

  hmacSha256(key: string | Buffer, data: string): Buffer {
    const hmac = CryptoJS.HmacSHA256(data, key.toString());
    // Convert WordArray to Buffer
    const wordArray = hmac.words;
    const byteArray = [];
    for (let i = 0; i < wordArray.length; i++) {
      const word = wordArray[i];
      byteArray.push((word >>> 24) & 0xFF);
      byteArray.push((word >>> 16) & 0xFF);
      byteArray.push((word >>> 8) & 0xFF);
      byteArray.push(word & 0xFF);
    }
    return Buffer.from(byteArray);
  }
}
```

```typescript
// packages/mobile/src/lib/http/mobile-http-client.ts
import type { IHttpClient } from '@rare-find/shared';

export class MobileHttpClient implements IHttpClient {
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}
```

```typescript
// packages/mobile/src/lib/logger/mobile-logger.ts
import type { ILogger } from '@rare-find/shared';

export class MobileLogger implements ILogger {
  debug(message: string, context?: Record<string, unknown>): void {
    console.debug(`[DEBUG] ${message}`, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info(`[INFO] ${message}`, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, context);
  }
}
```

#### 2. Use Shared Services

```typescript
import { MarketplaceService } from '@rare-find/shared';
import { AmazonClient, eBayClient } from '@rare-find/shared/lib/marketplace/clients';
import { ExpoCryptoProvider } from '@/lib/crypto/expo-crypto-provider';
import { MobileHttpClient } from '@/lib/http/mobile-http-client';
import { MobileLogger } from '@/lib/logger/mobile-logger';

// Create platform-specific providers
const logger = new MobileLogger();
const cryptoProvider = new ExpoCryptoProvider();
const httpClient = new MobileHttpClient();

// Create marketplace clients
const amazonClient = new AmazonClient(
  { accessKey: '...', secretKey: '...', associateTag: '...' },
  cryptoProvider,
  httpClient
);

const ebayClient = new eBayClient(
  { appId: '...' },
  httpClient
);

// Create marketplace service
const marketplaceService = new MarketplaceService(
  logger,
  amazonClient,
  ebayClient
);

// Use the service
const listing = await marketplaceService.fetchListingFromUrl(
  'https://www.amazon.com/dp/B08XYZ1234'
);
```

## Core Services

### MarketplaceService

Handles marketplace URL parsing, listing fetching, and search operations.

```typescript
import { MarketplaceService } from '@rare-find/shared';

// Parse marketplace URL
const { marketplace, marketplaceId } = service.parseMarketplaceUrl(
  'https://www.amazon.com/dp/B08XYZ1234'
);
// Returns: { marketplace: 'amazon', marketplaceId: 'B08XYZ1234' }

// Fetch listing from URL
const listing = await service.fetchListingFromUrl(
  'https://www.amazon.com/dp/B08XYZ1234'
);

// Get listing by ID
const listing = await service.getListingById('amazon', 'B08XYZ1234');

// Search listings
const results = await service.search({
  marketplace: 'amazon',
  query: 'laptop',
  category: 'Electronics',
});
```

### ListingService

Validates and normalizes marketplace listing data.

```typescript
import { ListingService } from '@rare-find/shared';

// Validate listing
service.validateListing(listing); // Throws ValidationError if invalid

// Normalize listing
const normalized = service.normalizeListing(listing);
// - Trims whitespace
// - Uppercases marketplace IDs
// - Normalizes prices
```

### EvaluationService

Evaluates marketplace listings using AI to determine market value and deal quality.

```typescript
import { EvaluationService } from '@rare-find/shared';
import OpenAI from 'openai';

const service = new EvaluationService(logger, openaiClient);

const result = await service.evaluateListing({
  listing: marketplaceListing,
  mode: 'multimodal', // or 'text-only'
  category: 'Electronics', // optional
});

// Result includes:
// - estimatedMarketValue
// - undervaluationPercentage
// - confidenceScore
// - reasoning
// - factors
```

## Marketplace Clients

### AmazonClient

Amazon PA-API 5.0 client with AWS Signature v4 authentication.

```typescript
import { AmazonClient } from '@rare-find/shared/lib/marketplace/clients';

const client = new AmazonClient(
  {
    accessKey: '...',
    secretKey: '...',
    associateTag: '...',
    region: 'us-east-1',
  },
  cryptoProvider,
  httpClient
);

const listing = await client.getItemById('B08XYZ1234');
const results = await client.search({ query: 'laptop', category: 'Electronics' });
```

### RapidAPIAmazonClient

Alternative Amazon client using RapidAPI Real-Time Amazon Data API.

```typescript
import { RapidAPIAmazonClient } from '@rare-find/shared/lib/marketplace/clients';

const client = new RapidAPIAmazonClient(
  {
    apiKey: '...',
    apiHost: 'real-time-amazon-data.p.rapidapi.com',
  },
  httpClient
);

const listing = await client.getItemById('B08XYZ1234');
```

### eBayClient

eBay Finding API client.

```typescript
import { eBayClient } from '@rare-find/shared/lib/marketplace/clients';

const client = new eBayClient(
  {
    appId: '...',
    authToken: '...', // optional
    siteId: 'EBAY-US',
  },
  httpClient
);

const listing = await client.getItemById('123456789');
const results = await client.search({ query: 'laptop', category: 'Electronics' });
```

## Rate Limiting

The shared package includes rate limiting for marketplace APIs:

```typescript
import { waitForRateLimit } from '@rare-find/shared';

// Wait for rate limit before making request
await waitForRateLimit('amazon'); // Amazon PA-API: 1 req/sec
await waitForRateLimit('amazon-rapidapi'); // RapidAPI: 5 req/sec
await waitForRateLimit('ebay'); // eBay: ~0.058 req/sec
```

## Error Handling

The shared package provides error classes for consistent error handling:

```typescript
import { AppError, ValidationError, NotFoundError, UnauthorizedError, RateLimitError } from '@rare-find/shared';

// Base error class
throw new AppError('Something went wrong', 500, 'ERROR_CODE');

// Validation error
throw new ValidationError('Invalid listing data');

// Not found error
throw new NotFoundError('Listing not found');

// Unauthorized error
throw new UnauthorizedError('Authentication required');

// Rate limit error
throw new RateLimitError('Rate limit exceeded');
```

## Type Definitions

All types are exported from the main package:

```typescript
import type {
  // Marketplace types
  Marketplace,
  MarketplaceListing,
  MarketplaceSearchParams,
  MarketplaceSearchResult,

  // Evaluation types
  EvaluationMode,
  EvaluationInput,
  EvaluationResult,
  AIEvaluationResponse,

  // Client types
  AmazonCredentials,
  eBayCredentials,
  RapidAPIConfig,
} from '@rare-find/shared';
```

## Development

### Type Check

```bash
npm run type:check
```

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

Target: 80%+ coverage for all shared package code.

## Adding New Code

When adding shared code:

1. **Place business logic in `src/lib/`** - Organized by domain (marketplace, listing, evaluation)
2. **Place types in `src/types/`** - Centralized type exports
3. **Export from `src/index.ts`** - Main package entry point
4. **Ensure platform-agnostic** - No DOM APIs, no Node.js-specific code
5. **Use dependency injection** - Accept interfaces (ILogger, ICryptoProvider, IHttpClient) via constructor
6. **Add tests** - Maintain 80%+ coverage
7. **Update this README** - Document new services and usage

## Platform-Specific Implementations

The shared package requires platform-specific implementations of:

- **ILogger**: Logging interface
  - Web: `LoggerService` (with Sentry integration)
  - Mobile: `MobileLogger` (console-based)

- **ICryptoProvider**: Cryptographic operations
  - Web: `NodeCryptoProvider` (uses `node:crypto`)
  - Mobile: `ExpoCryptoProvider` (uses `crypto-js`)

- **IHttpClient**: HTTP requests
  - Web: `WebHttpClient` (wraps `fetch`)
  - Mobile: `MobileHttpClient` (wraps `fetch`)

## Testing

All shared package code is tested with Vitest. Tests are located in `__tests__/` directories mirroring the source structure.

```typescript
// Example test
import { MarketplaceService } from '../lib/marketplace/services/marketplace.service';
import { createMockLogger, createMockCrypto, createMockHttp } from './test-utils';

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

## Database Types

The shared package includes Supabase Database types that are generated from your Supabase schema. These types are shared between web and mobile packages to ensure consistency.

### Generating Database Types

```bash
cd packages/shared
npm run db:generate-types
```

**Required environment variables:**
- `SUPABASE_ACCESS_TOKEN` - Get from https://app.supabase.com/account/tokens
- `SUPABASE_PROJECT_ID` - Optional, defaults to `xabpmvuubgfjuroenxuq`

**Usage:**

```typescript
import type { Database } from '@rare-find/shared';

// Use Database type with Supabase client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient<Database>(url, key);
```

See [scripts/README.md](./scripts/README.md) for detailed instructions.

## License

Internal package - not for public distribution.
