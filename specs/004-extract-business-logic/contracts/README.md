# Service Contracts: Extract Business Logic to Shared Package

**Feature**: 004-extract-business-logic
**Date**: 2026-01-02

## Overview

This directory contains service contracts (interfaces) that define the API between shared package and platform-specific implementations. These contracts enable dependency injection and ensure consistent behavior across web and mobile platforms.

## Contract Files

### interfaces.ts

Defines all service interfaces that will be exported from shared package:

- `IMarketplaceService` - Marketplace operations (URL parsing, listing fetching, search)
- `IEvaluationService` - AI evaluation operations
- `IListingService` - Listing validation and normalization
- `ILogger` - Logging operations
- `ICryptoProvider` - Cryptographic operations (SHA256, HMAC-SHA256)
- `IHttpClient` - HTTP request operations

## Contract Principles

1. **Platform Agnostic**: All interfaces must not reference platform-specific types or APIs
2. **Dependency Injection**: Services accept platform-specific implementations via constructor injection
3. **Type Safety**: All method signatures must be fully typed
4. **Error Handling**: Methods must throw appropriate error types (AppError, ValidationError, etc.)
5. **Immutability**: Input parameters should not be mutated

## Usage Pattern

### Web Package Implementation

```typescript
// Web-specific implementations
import { NodeCryptoProvider } from '@/lib/crypto/node-crypto-provider';
import { WebLogger } from '@/lib/logger/web-logger';
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services';

// Create service with platform-specific dependencies
const marketplaceService = new MarketplaceService(
  new WebLogger(),
  new NodeCryptoProvider(),
  nativeFetch // or custom HTTP client
);
```

### Mobile Package Implementation

```typescript
// Mobile-specific implementations
import { ExpoCryptoProvider } from '@/lib/crypto/expo-crypto-provider';
import { MobileLogger } from '@/lib/logger/mobile-logger';
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services';

// Create service with platform-specific dependencies
const marketplaceService = new MarketplaceService(
  new MobileLogger(),
  new ExpoCryptoProvider(),
  fetch // React Native fetch
);
```

## Contract Stability

These contracts are considered stable and should not change without:
1. Version bump in shared package
2. Migration guide for platform packages
3. Backward compatibility considerations
