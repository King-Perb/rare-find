# Data Model: Extract Business Logic to Shared Package

**Feature**: 004-extract-business-logic
**Date**: 2026-01-02

## Overview

This feature extracts business logic from web package to shared package. The data model focuses on the interfaces, types, and service contracts that will be shared across platforms.

## Core Entities

### MarketplaceListing

Represents a product listing from Amazon or eBay.

**Fields**:
- `id: string` - Unique identifier
- `marketplace: 'amazon' | 'ebay'` - Marketplace source
- `marketplaceId: string` - Marketplace-specific ID (ASIN for Amazon, item ID for eBay)
- `title: string` - Product title
- `description?: string` - Product description (optional)
- `price: number` - Price in specified currency
- `currency: string` - Currency code (default: 'USD')
- `images: string[]` - Array of image URLs
- `category?: string` - Product category
- `condition?: string` - Item condition
- `sellerName?: string` - Seller name
- `sellerRating?: number` - Seller rating
- `listingUrl: string` - URL to the listing
- `available: boolean` - Whether item is currently available

**Validation Rules**:
- `title` must not be empty
- `price` must be greater than 0
- `marketplace` must be 'amazon' or 'ebay'
- `marketplaceId` must not be empty
- `listingUrl` must be a valid URL

**Relationships**:
- Used by: EvaluationService, ListingService, MarketplaceService

### EvaluationResult

Represents the output of AI evaluation.

**Fields**:
- `evaluation: AIEvaluationResponse` - Raw AI evaluation data
  - `estimatedMarketValue: number` - Estimated market value in USD
  - `undervaluationPercentage: number` - Percentage of undervaluation (e.g., 25.5)
  - `confidenceScore: number` - Confidence score from 0-100
  - `reasoning: string` - Detailed reasoning explanation
  - `factors: string[]` - Array of factors that influenced evaluation
  - `isReplicaOrNovelty?: boolean` - Whether item is replica/novelty
- `modelVersion: string` - Model version used (e.g., "gpt-4o")
- `promptVersion: string` - Prompt version used (e.g., "1.2.0")
- `evaluationMode: 'multimodal' | 'text-only'` - Evaluation mode used
- `evaluatedAt: Date` - Timestamp of evaluation
- `webSearchUsed?: boolean` - Whether web search was used
- `webSearchCitations?: WebSearchCitation[]` - Citations from web search

**Validation Rules**:
- `confidenceScore` must be between 0 and 100
- `undervaluationPercentage` must be >= 0
- `estimatedMarketValue` must be > 0

**Relationships**:
- Created by: EvaluationService
- References: MarketplaceListing

### Service Interfaces

#### IMarketplaceService

Contract for marketplace operations.

**Methods**:
- `parseMarketplaceUrl(url: string): { marketplace: 'amazon' | 'ebay', marketplaceId: string }`
- `fetchListingFromUrl(listingUrl: string): Promise<MarketplaceListing>`
- `getListingById(marketplace: 'amazon' | 'ebay', marketplaceId: string): Promise<MarketplaceListing | null>`
- `search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult>`

#### IEvaluationService

Contract for AI evaluation operations.

**Methods**:
- `evaluateListing(input: EvaluationInput): Promise<EvaluationResult>`

#### IListingService

Contract for listing validation and normalization.

**Methods**:
- `validateListing(listing: MarketplaceListing): void`
- `normalizeListing(listing: MarketplaceListing): MarketplaceListing`

#### ILogger

Contract for logging operations.

**Methods**:
- `debug(message: string, context?: Record<string, unknown>): void`
- `info(message: string, context?: Record<string, unknown>): void`
- `warn(message: string, context?: Record<string, unknown>): void`
- `error(message: string, context?: Record<string, unknown>): void`

#### ICryptoProvider

Contract for cryptographic operations (platform-agnostic).

**Methods**:
- `sha256(data: string): string` - Calculate SHA256 hash
- `hmacSha256(key: string | Buffer, data: string): Buffer` - Calculate HMAC-SHA256

#### IHttpClient

Contract for HTTP requests (platform-agnostic).

**Methods**:
- `fetch(url: string, options?: RequestInit): Promise<Response>` - Make HTTP request

### Error Classes

#### AppError

Base application error class.

**Fields**:
- `message: string` - Error message
- `statusCode: number` - HTTP status code (default: 500)
- `code?: string` - Error code for programmatic handling
- `details?: unknown` - Additional error details

**Subclasses**:
- `ValidationError` - 400 status code, 'VALIDATION_ERROR' code
- `NotFoundError` - 404 status code, 'NOT_FOUND' code
- `UnauthorizedError` - 401 status code, 'UNAUTHORIZED' code
- `RateLimitError` - 429 status code, 'RATE_LIMIT_EXCEEDED' code

### Rate Limiter

Token bucket implementation for API rate limiting.

**Configuration**:
- Amazon PA-API: 1 token/second, capacity 1
- Amazon RapidAPI: 5 tokens/second, capacity 5
- eBay: ~0.058 tokens/second, capacity ~0.058

**Methods**:
- `canMakeRequest(source: RateLimitSource): boolean` - Check if request can be made
- `consumeToken(source: RateLimitSource): void` - Consume a token
- `getWaitTime(source: RateLimitSource): number` - Get wait time in milliseconds
- `waitAndConsume(source: RateLimitSource): Promise<void>` - Wait and consume token

### AI Prompt Templates

Version-controlled prompt templates for AI evaluation.

**Fields**:
- `PROMPT_VERSION: string` - Current prompt version (e.g., "1.2.0")
- `MODEL_VERSION: string` - Model version (from env or default: "gpt-4o")
- Prompt functions for multimodal and text-only evaluation modes

## Type Definitions

### MarketplaceSearchParams

Search parameters for marketplace queries.

**Fields**:
- `keywords?: string[]` - Search keywords
- `category?: string` - Product category
- `minPrice?: number` - Minimum price filter
- `maxPrice?: number` - Maximum price filter
- `condition?: string` - Item condition filter
- `sortBy?: 'price' | 'relevance' | 'newest'` - Sort order
- `limit?: number` - Results per page
- `offset?: number` - Pagination offset

### MarketplaceSearchResult

Search results from marketplace.

**Fields**:
- `listings: MarketplaceListing[]` - Array of listings
- `total: number` - Total number of results
- `hasMore: boolean` - Whether more results are available

### EvaluationInput

Input for AI evaluation.

**Fields**:
- `listing: MarketplaceListing` - Listing to evaluate
- `mode: 'multimodal' | 'text-only'` - Evaluation mode
- `category?: string` - Optional category context

## State Transitions

### Listing Validation Flow

```
Raw Listing Data
  ↓
[validateListing] → ValidationError (if invalid)
  ↓
Valid Listing
  ↓
[normalizeListing] → Normalized Listing
```

### Marketplace URL Parsing Flow

```
URL String
  ↓
[parseMarketplaceUrl] → ValidationError (if invalid URL)
  ↓
{ marketplace, marketplaceId }
  ↓
[getListingById] → MarketplaceListing | null
```

### Evaluation Flow

```
MarketplaceListing + Mode
  ↓
[evaluateListing] → AppError (if evaluation fails)
  ↓
EvaluationResult
```

## Data Flow

### Marketplace Service Flow

```
User Input (URL)
  ↓
MarketplaceService.parseMarketplaceUrl()
  ↓
{ marketplace, marketplaceId }
  ↓
MarketplaceClient.getItemById() [with rate limiting]
  ↓
MarketplaceListing
```

### Evaluation Service Flow

```
MarketplaceListing
  ↓
EvaluationService.evaluateListing()
  ↓
AI Prompts (from shared)
  ↓
OpenAI API (via platform-specific client)
  ↓
EvaluationResult
```

## Constraints

1. **Platform Independence**: All shared entities must not depend on platform-specific APIs
2. **Dependency Injection**: Platform-specific dependencies (crypto, HTTP, logging) must be injected via interfaces
3. **Type Safety**: All entities must be fully typed with TypeScript strict mode
4. **Immutability**: Service interfaces should not mutate input parameters
5. **Error Handling**: All service methods must throw appropriate error types

## Notes

- Error classes are platform-agnostic (no Sentry dependencies)
- Rate limiter uses only JavaScript primitives (platform-agnostic)
- AI prompts are pure strings/functions (platform-agnostic)
- Marketplace clients accept platform-specific providers via dependency injection
