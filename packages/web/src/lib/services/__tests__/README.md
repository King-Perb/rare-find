# Service Tests

Comprehensive test suite for all service implementations using dependency injection and mocking.

## Test Coverage

### ✅ LoggerService (8 tests)
- Info, warn, error logging
- Debug logging (development vs production)
- Context inclusion in logs

### ✅ ListingService (17 tests)
- Listing validation (title, price, marketplace, etc.)
- Listing normalization (trim, uppercase, defaults)
- Edge cases and error handling

### ✅ MarketplaceService (22 tests)
- URL parsing for Amazon and eBay
- Listing fetching from URLs
- Marketplace client integration
- Error handling and logging

### ✅ EvaluationService (6 tests)
- AI evaluation execution
- Multimodal vs text-only modes
- Error handling and logging
- Result transformation

### ✅ AuthService (9 tests)
- User authentication
- Session management
- Sign out functionality
- Error handling

### ✅ DatabaseService (14 tests)
- User operations
- Listing operations
- Evaluation operations
- Recommendation operations
- Notification operations
- Preference operations

## Running Tests

```bash
# Run all service tests
npm test -- src/lib/services/__tests__

# Run specific test file
npm test -- src/lib/services/__tests__/listing.service.test.ts

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

## Mocking Dependencies

Services are designed to accept dependencies via constructor injection, making them easy to test:

```typescript
import { ListingService } from '../listing.service';
import { createMockLogger } from './test-utils';

const mockLogger = createMockLogger();
const service = new ListingService(mockLogger);

// Test the service
service.validateListing(listing);
expect(mockLogger.info).toHaveBeenCalled();
```

## Testing with DI Container

For integration tests, you can register mocks in the DI container:

```typescript
import { container, ServiceKeys } from '../../di/container';
import { createMockMarketplaceService } from './test-utils';

// Register mock
container.register(ServiceKeys.MarketplaceService, () =>
  createMockMarketplaceService()
);

// Resolve and use
const service = container.resolve<IMarketplaceService>(
  ServiceKeys.MarketplaceService
);
```

## Test Structure

Each test file follows this structure:

1. **Setup**: Create service instance with mocked dependencies
2. **Tests**: Grouped by method/feature
3. **Assertions**: Verify behavior and side effects

Example:

```typescript
describe('ListingService', () => {
  let service: ListingService;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    service = new ListingService(mockLogger);
  });

  describe('validateListing', () => {
    it('should validate a valid listing', () => {
      // Test implementation
    });
  });
});
```

## Best Practices

1. **Isolate tests**: Each test should be independent
2. **Mock external dependencies**: Don't make real API calls
3. **Test edge cases**: Include error scenarios
4. **Verify side effects**: Check logging, error handling
5. **Use descriptive test names**: Clear what is being tested

## Adding New Tests

When adding a new service:

1. Create test file: `__tests__/new-service.test.ts`
2. Import test utilities: `from './test-utils'`
3. Mock dependencies: Use `createMock*` functions
4. Write comprehensive tests: Cover all methods and edge cases
5. Update this README: Add to test coverage list

## Continuous Integration

Tests run automatically in CI/CD pipeline. All tests must pass before merging.
