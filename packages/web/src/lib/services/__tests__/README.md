# Service Tests

Test suite for web-specific services and integration tests for shared services.

## Test Strategy

### Shared Package Tests
The shared package (`@rare-find/shared`) contains comprehensive unit tests for all business logic:
- **MarketplaceService**: 21 tests covering URL parsing, listing fetching, search
- **ListingService**: 17 tests covering validation and normalization
- **EvaluationService**: 6 tests covering AI evaluation logic
- **Marketplace Clients**: Tests for Amazon, eBay, and RapidAPI clients
- **Rate Limiter**: Tests for rate limiting logic

**We do NOT duplicate these tests in the web package.**

### Web Package Tests

#### Integration Tests (`src/lib/__tests__/integration/`)
Tests that verify shared services work correctly with web-specific providers:

1. **Service Integration Tests**:
   - **MarketplaceService Integration**: Tests with `NodeCryptoProvider` and `WebHttpClient`
   - **ListingService Integration**: Tests with web logger
   - **EvaluationService Integration**: Tests with web OpenAI client and logger

2. **Full Stack Integration Tests**:
   - **API Route Integration**: Tests the complete flow from API route → DI container → shared services → platform providers

These tests verify:
- ✅ **Shared services work with real platform providers** (NodeCryptoProvider, WebHttpClient)
- ✅ **Dependency injection works correctly** (services resolve from DI container with proper providers)
- ✅ **Full flow from API route → shared service → platform providers** (end-to-end integration)

#### Web-Specific Service Tests (`src/lib/services/__tests__/`)
Unit tests for services that are web-specific:
- **LoggerService** (8 tests): Sentry integration, logging levels
- **AuthService** (9 tests): User authentication, session management
- **DatabaseService** (14 tests): Database operations

## Test Coverage

### ✅ Integration Tests
- **Service Integration** (16 tests):
  - MarketplaceService with NodeCryptoProvider + WebHttpClient
  - ListingService with web logger
  - EvaluationService with web OpenAI client
- **Full Stack Integration** (5 tests):
  - API route → DI container → shared services → platform providers
  - Error handling through full stack
  - DI container resolution verification

### ✅ Web-Specific Services
- LoggerService (8 tests)
- AuthService (9 tests)
- DatabaseService (14 tests)

## Running Tests

```bash
# Run all service tests (web-specific only)
npm test -- src/lib/services/__tests__

# Run integration tests
npm test -- src/lib/__tests__/integration

# Run specific test file
npm test -- src/lib/services/__tests__/logger.service.test.ts

# Watch mode
npm run test:watch -- src/lib/services/__tests__

# With coverage
npm run test:coverage -- src/lib/services/__tests__
```

## Test Utilities

The `test-utils.ts` file provides helper functions for creating mocks:

```typescript
import { createMockLogger, createSampleListing } from './test-utils';

// Create mock logger
const mockLogger = createMockLogger();

// Create sample listing for testing
const listing = createSampleListing({
  title: 'Custom Title',
  price: 99.99,
});
```

## Integration Test Example

```typescript
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
import { NodeCryptoProvider } from '../../crypto/node-crypto-provider';
import { WebHttpClient } from '../../http/web-http-client';

describe('MarketplaceService Integration', () => {
  it('should work with web providers', () => {
    const cryptoProvider = new NodeCryptoProvider();
    const httpClient = new WebHttpClient();
    const amazonClient = new AmazonClient(credentials, cryptoProvider, httpClient);
    const service = new MarketplaceService(logger, amazonClient, ebayClient);

    // Test that service works with web providers
  });
});
```

## Best Practices

1. **Don't duplicate shared tests**: Business logic is tested in shared package
2. **Focus on integration**: Test that shared services work with web providers
3. **Test web-specific code**: LoggerService, AuthService, DatabaseService
4. **Mock external dependencies**: Don't make real API calls in tests
5. **Verify side effects**: Check logging, error handling

## Adding New Tests

### For Shared Services
If you need to test shared services, add integration tests in `src/lib/__tests__/integration/` that verify:
- Services work with web-specific providers
- Dependency injection functions correctly
- Platform-specific implementations integrate properly

### For Web-Specific Services
Add unit tests in `src/lib/services/__tests__/` for:
- New web-specific services
- Web-specific utilities
- Platform-specific implementations

## Continuous Integration

Tests run automatically in CI/CD pipeline. All tests must pass before merging.
