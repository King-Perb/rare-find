# Architecture Refactoring: Dependency Injection & Service Extraction

## Overview

This refactoring introduces dependency injection (DI) and extracts business logic into service classes, making the codebase more testable, maintainable, and following SOLID principles.

## What Changed

### 1. Dependency Injection Container

**Location**: `src/lib/di/`

- **`container.ts`**: Simple DI container with service registration and resolution
- **`setup.ts`**: Service registration and initialization
- **`index.ts`**: Central export point

**Features**:
- Singleton support
- Service factory pattern
- Child containers for request-scoped services
- Type-safe service resolution

### 2. Service Interfaces

**Location**: `src/lib/services/interfaces.ts`

Defines contracts for all services:
- `ILogger`: Logging operations
- `IMarketplaceService`: Marketplace operations (URL parsing, fetching)
- `IListingService`: Listing validation and normalization
- `IEvaluationService`: AI evaluation operations
- `IDatabaseService`: Database operations
- `IAuthService`: Authentication operations

### 3. Service Implementations

**Location**: `src/lib/services/`

#### LoggerService
- Implements `ILogger`
- Replaces direct `Logger` class usage
- Maintains backward compatibility via legacy export

#### MarketplaceService
- Handles marketplace URL parsing
- Manages marketplace clients (Amazon, eBay)
- Fetches listings from marketplaces
- Supports dependency injection of clients for testing

#### ListingService
- Validates listing data
- Normalizes listing data (trim, format, etc.)

#### EvaluationService
- Wraps AI evaluation logic
- Handles evaluation errors and logging

#### AuthService
- Wraps Supabase auth operations
- Provides consistent interface for authentication

#### DatabaseService
- Wraps database query functions
- Provides interface for database operations

### 4. Refactored Route Handlers

**Location**: `src/app/api/marketplace/evaluate/route.ts`

**Before**:
- Business logic mixed with route handling
- Direct function calls to marketplace clients
- Hard to test

**After**:
- Clean route handler that delegates to services
- Services resolved from DI container
- Easy to mock for testing

## Benefits

### 1. **Testability**
- Services can be easily mocked
- Dependencies are injected, not hard-coded
- Unit tests can test services in isolation

### 2. **Maintainability**
- Business logic separated from route handlers
- Single Responsibility Principle (SRP)
- Changes to one service don't affect others

### 3. **Flexibility**
- Easy to swap implementations (e.g., different logger)
- Services can be extended without modifying existing code
- Supports different configurations per environment

### 4. **Type Safety**
- TypeScript interfaces ensure contracts
- Compile-time checking of service dependencies

## Usage Examples

### Resolving Services

```typescript
import { container, ServiceKeys } from '@/lib/di';
import type { IMarketplaceService } from '@/lib/services/interfaces';

// Resolve service
const marketplaceService = container.resolve<IMarketplaceService>(
  ServiceKeys.MarketplaceService
);

// Use service
const listing = await marketplaceService.fetchListingFromUrl(url);
```

### Testing with Mocks

```typescript
import { container, ServiceKeys } from '@/lib/di';
import type { IMarketplaceService } from '@/lib/services/interfaces';

// Create mock
const mockMarketplaceService: IMarketplaceService = {
  parseMarketplaceUrl: jest.fn(),
  fetchListingFromUrl: jest.fn(),
  getListingById: jest.fn(),
  search: jest.fn(),
};

// Register mock
container.register(ServiceKeys.MarketplaceService, () => mockMarketplaceService);

// Test your code
```

## Migration Guide

### For Route Handlers

**Before**:
```typescript
import { createAmazonClient } from '@/lib/marketplace/amazon/client';
const client = createAmazonClient();
const listing = await client.getItemById(id);
```

**After**:
```typescript
import { container, ServiceKeys } from '@/lib/di';
import type { IMarketplaceService } from '@/lib/services/interfaces';

const marketplaceService = container.resolve<IMarketplaceService>(
  ServiceKeys.MarketplaceService
);
const listing = await marketplaceService.getListingById('amazon', id);
```

### For Logger

**Before**:
```typescript
import { logger } from '@/lib/logger';
logger.info('message');
```

**After** (still works - backward compatible):
```typescript
import { logger } from '@/lib/logger';
logger.info('message');
```

**Or use DI**:
```typescript
import { container, ServiceKeys } from '@/lib/di';
import type { ILogger } from '@/lib/services/interfaces';

const logger = container.resolve<ILogger>(ServiceKeys.Logger);
logger.info('message');
```

## Next Steps

1. **Write Tests**: Create unit tests for services using mocked dependencies
2. **Refactor Other Routes**: Apply same pattern to other API routes
3. **Add More Services**: Extract more business logic into services as needed
4. **Service Documentation**: Add JSDoc comments to service interfaces

## File Structure

```
src/lib/
├── di/
│   ├── container.ts      # DI container implementation
│   ├── setup.ts          # Service registration
│   └── index.ts          # Exports
├── services/
│   ├── interfaces.ts     # Service contracts
│   ├── logger.service.ts
│   ├── marketplace.service.ts
│   ├── listing.service.ts
│   ├── evaluation.service.ts
│   ├── auth.service.ts
│   ├── database.service.ts
│   └── index.ts          # Exports
└── logger.ts             # Legacy export (backward compatible)
```

## Notes

- The DI container auto-initializes on import
- Services are registered as singletons by default
- Legacy `logger` export maintains backward compatibility
- All services follow the interface contracts for consistency
