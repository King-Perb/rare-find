# Feature Specification: Extract Business Logic to Shared Package

**Feature Branch**: `004-extract-business-logic`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "extracting business logic from web to shared so that mobile can also use it"

## Clarifications

### Session 2026-01-02

- Q: Should additional shareable business logic components (rate limiter, AI prompts, marketplace clients) be included in extraction scope? → A: Include all shareable business logic components (rate limiter, AI prompts, marketplace clients with crypto abstraction)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile App Uses Shared Marketplace Logic (Priority: P1)

As a mobile app developer, I need to use the same marketplace URL parsing and listing fetching logic that the web app uses, so that both platforms have consistent behavior and I don't need to duplicate code.

**Why this priority**: This is the core value proposition - enabling code reuse between web and mobile platforms. Without this, mobile would need to reimplement marketplace logic, leading to inconsistencies and maintenance burden.

**Independent Test**: Can be fully tested by importing marketplace service from shared package in mobile app and verifying it can parse URLs and fetch listings identically to web app.

**Acceptance Scenarios**:

1. **Given** a marketplace URL (Amazon or eBay), **When** mobile app calls shared marketplace service to parse URL, **Then** it extracts marketplace and marketplace ID correctly
2. **Given** a valid marketplace ID, **When** mobile app calls shared marketplace service to fetch listing, **Then** it returns listing data in the same format as web app
3. **Given** an invalid marketplace URL, **When** mobile app calls shared marketplace service, **Then** it receives the same validation error that web app would return

---

### User Story 2 - Mobile App Uses Shared Listing Validation Logic (Priority: P1)

As a mobile app developer, I need to use the same listing validation and normalization logic that the web app uses, so that data quality is consistent across platforms.

**Why this priority**: Data validation is critical for data integrity. Having shared validation ensures both platforms enforce the same business rules.

**Independent Test**: Can be fully tested by importing listing service from shared package in mobile app and verifying it validates and normalizes listing data identically to web app.

**Acceptance Scenarios**:

1. **Given** listing data with missing required fields, **When** mobile app calls shared listing service to validate, **Then** it throws the same validation errors as web app
2. **Given** listing data with inconsistent formatting, **When** mobile app calls shared listing service to normalize, **Then** it returns normalized data in the same format as web app
3. **Given** valid listing data, **When** mobile app calls shared listing service to validate and normalize, **Then** it passes validation and returns normalized data

---

### User Story 3 - Mobile App Uses Shared AI Evaluation Logic (Priority: P2)

As a mobile app developer, I need to use the same AI evaluation logic that the web app uses, so that listing evaluations are consistent and accurate across platforms.

**Why this priority**: AI evaluation is a core feature. Sharing this logic ensures consistent evaluation results and reduces maintenance of duplicate AI integration code.

**Independent Test**: Can be fully tested by importing evaluation service from shared package in mobile app and verifying it produces the same evaluation results for the same listing input as web app.

**Acceptance Scenarios**:

1. **Given** a marketplace listing, **When** mobile app calls shared evaluation service, **Then** it receives evaluation results in the same format as web app
2. **Given** the same listing input, **When** both web and mobile apps call shared evaluation service, **Then** they receive identical evaluation results
3. **Given** an evaluation request with invalid input, **When** mobile app calls shared evaluation service, **Then** it receives the same error handling as web app

---

### User Story 4 - Mobile App Uses Shared Rate Limiting Logic (Priority: P2)

As a mobile app developer, I need to use the same rate limiting logic that the web app uses, so that both platforms respect marketplace API rate limits consistently and avoid API throttling.

**Why this priority**: Rate limiting is critical for API reliability. Sharing this logic ensures both platforms use the same token bucket algorithm and rate limit configurations, preventing API errors and maintaining service availability.

**Independent Test**: Can be fully tested by importing rate limiter from shared package in mobile app and verifying it enforces the same rate limits (Amazon PA-API: 1 req/sec, eBay: ~0.058 req/sec) as web app.

**Acceptance Scenarios**:

1. **Given** a marketplace API call, **When** mobile app uses shared rate limiter, **Then** it waits appropriately before making requests to respect rate limits
2. **Given** multiple rapid API calls, **When** mobile app uses shared rate limiter, **Then** it throttles requests identically to web app behavior
3. **Given** different marketplace APIs (Amazon PA-API, Amazon RapidAPI, eBay), **When** mobile app uses shared rate limiter, **Then** it applies correct rate limits for each API source

---

### User Story 5 - Mobile App Uses Shared AI Prompts (Priority: P2)

As a mobile app developer, I need to use the same AI prompt templates that the web app uses, so that evaluation results are consistent and prompt versions are managed centrally.

**Why this priority**: AI prompts are core business logic that determine evaluation quality. Sharing prompts ensures consistent evaluation results and enables centralized prompt versioning and updates.

**Independent Test**: Can be fully tested by importing AI prompts from shared package in mobile app and verifying it uses the same prompt templates and versions as web app.

**Acceptance Scenarios**:

1. **Given** an evaluation request, **When** mobile app uses shared AI prompts, **Then** it uses the same prompt template as web app
2. **Given** a prompt version update, **When** both platforms use shared prompts, **Then** they automatically use the new version without code changes
3. **Given** multimodal and text-only evaluation modes, **When** mobile app uses shared prompts, **Then** it selects the correct prompt variant for each mode

---

### User Story 6 - Mobile App Uses Shared Marketplace Clients (Priority: P2)

As a mobile app developer, I need to use the same marketplace API client implementations that the web app uses, so that API interactions are consistent and authentication logic is shared.

**Why this priority**: Marketplace clients contain complex business logic (authentication, request building, response transformation). Sharing these ensures consistent API interactions and reduces maintenance burden of duplicate client code.

**Independent Test**: Can be fully tested by importing marketplace clients from shared package in mobile app with platform-specific crypto and HTTP providers, and verifying it produces identical API requests and handles responses the same way as web app.

**Acceptance Scenarios**:

1. **Given** Amazon API credentials, **When** mobile app uses shared Amazon client with mobile crypto provider, **Then** it generates valid AWS Signature v4 authentication identical to web app
2. **Given** eBay API credentials, **When** mobile app uses shared eBay client, **Then** it makes API requests with identical query parameters as web app
3. **Given** API responses, **When** mobile app uses shared marketplace clients, **Then** it transforms responses to MarketplaceListing format identically to web app

---

### User Story 7 - Developers Use Shared Types and Interfaces (Priority: P2)

As a developer working on either web or mobile, I need to use shared type definitions and service interfaces, so that I have consistent contracts and can easily understand what services are available.

**Why this priority**: Shared types and interfaces enable type safety and clear contracts between platforms. This reduces bugs from type mismatches and makes the codebase more maintainable.

**Independent Test**: Can be fully tested by importing types and interfaces from shared package in both web and mobile apps and verifying TypeScript compilation succeeds with consistent types.

**Acceptance Scenarios**:

1. **Given** a marketplace listing type from shared package, **When** web and mobile apps use it, **Then** TypeScript recognizes it as the same type
2. **Given** a service interface from shared package, **When** both platforms implement it, **Then** they must satisfy the same contract
3. **Given** shared types are updated, **When** both platforms pull the update, **Then** TypeScript compilation catches any breaking changes in both platforms

---

### Edge Cases

- What happens when shared package has a breaking change? Both platforms must update together or maintain backward compatibility
- How does system handle platform-specific dependencies (e.g., Sentry for web, different logging for mobile)? Shared logic must abstract these dependencies through interfaces
- What happens when a marketplace API changes? Shared marketplace service must handle versioning and backward compatibility
- How does system handle different environment variable names between platforms? Shared services must accept configuration through dependency injection rather than direct environment access
- What happens when mobile needs different error handling than web? Shared error classes must be flexible enough for both platforms or abstracted through interfaces
- How does system handle platform-specific crypto implementations? Marketplace clients must accept ICryptoProvider interface, with web using node:crypto and mobile using expo-crypto or react-native-crypto
- How does system handle platform-specific HTTP clients? Marketplace clients must accept IHttpClient interface, with both platforms potentially using fetch but abstracted for flexibility
- What happens when rate limit configurations need to differ between platforms? Rate limiter must be configurable per platform while maintaining shared algorithm logic

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Shared package MUST provide marketplace URL parsing functionality that extracts marketplace type and ID from URLs
- **FR-002**: Shared package MUST provide marketplace listing fetching functionality that retrieves listing data from marketplace APIs
- **FR-003**: Shared package MUST provide listing validation functionality that enforces business rules for listing data
- **FR-004**: Shared package MUST provide listing normalization functionality that standardizes listing data format
- **FR-005**: Shared package MUST provide AI evaluation functionality that evaluates marketplace listings using AI
- **FR-006**: Shared package MUST provide rate limiting functionality for marketplace API calls using token bucket algorithm
- **FR-007**: Shared package MUST provide AI prompt templates and prompt versioning for consistent evaluation prompts across platforms
- **FR-008**: Shared package MUST provide marketplace API client implementations (Amazon, eBay) with platform-agnostic abstractions for crypto operations and HTTP requests
- **FR-009**: Shared package MUST export all marketplace-related types (MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult, etc.)
- **FR-010**: Shared package MUST export all AI evaluation-related types (EvaluationInput, EvaluationResult, AIEvaluationResponse, etc.)
- **FR-011**: Shared package MUST export service interfaces (IMarketplaceService, IEvaluationService, IListingService, ILogger, ICryptoProvider, IHttpClient) for dependency injection
- **FR-012**: Shared package MUST export error classes (AppError, ValidationError, NotFoundError, etc.) that are platform-agnostic
- **FR-013**: Web package MUST import marketplace, evaluation, listing services, rate limiter, AI prompts, and marketplace clients from shared package instead of local implementations
- **FR-014**: Mobile package MUST be able to import and use marketplace, evaluation, listing services, rate limiter, AI prompts, and marketplace clients from shared package
- **FR-015**: Shared business logic MUST not depend on platform-specific libraries (e.g., Next.js, React Native, Sentry, node:crypto) directly
- **FR-016**: Shared business logic MUST accept platform-specific dependencies (e.g., logger, HTTP client, crypto provider) through dependency injection
- **FR-017**: Marketplace clients MUST accept crypto provider interface (ICryptoProvider) for platform-agnostic cryptographic operations (SHA256, HMAC-SHA256)
- **FR-018**: Marketplace clients MUST accept HTTP client interface (IHttpClient) for platform-agnostic HTTP requests
- **FR-019**: Both web and mobile packages MUST be able to use the same service implementations, rate limiter, AI prompts, and marketplace clients from shared package
- **FR-020**: Service implementations, rate limiter, AI prompts, and marketplace clients in shared package MUST be testable independently of platform-specific code

### Key Entities *(include if feature involves data)*

- **MarketplaceListing**: Represents a product listing from Amazon or eBay, containing title, price, images, seller information, and marketplace metadata
- **EvaluationResult**: Represents the output of AI evaluation, containing estimated market value, confidence score, reasoning, and evaluation metadata
- **Service Interface**: Defines the contract that service implementations must satisfy, enabling dependency injection and testing
- **Error Class**: Represents application errors with status codes, error codes, and details, abstracted from platform-specific error handling
- **Rate Limiter**: Implements token bucket algorithm for managing API rate limits across different marketplace APIs (Amazon PA-API, Amazon RapidAPI, eBay)
- **AI Prompt Template**: Version-controlled prompt templates for AI evaluation, ensuring consistent evaluation logic across platforms
- **Marketplace Client**: Platform-agnostic implementation of marketplace API clients (Amazon, eBay) that accepts crypto and HTTP providers via dependency injection

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Mobile app can successfully parse marketplace URLs using shared package, with 100% consistency with web app behavior
- **SC-002**: Mobile app can successfully fetch marketplace listings using shared package, with identical data format as web app
- **SC-003**: Mobile app can successfully validate and normalize listings using shared package, with 100% consistency with web app validation rules
- **SC-004**: Mobile app can successfully evaluate listings using shared package, producing evaluation results within 5% variance of web app results for the same input
- **SC-005**: Both web and mobile packages compile successfully with shared package imports, with zero TypeScript errors related to type mismatches
- **SC-006**: Mobile app can successfully use shared rate limiter to respect marketplace API rate limits, with identical rate limiting behavior as web app
- **SC-007**: Mobile app can successfully use shared AI prompts, ensuring evaluation prompts are identical to web app and version-controlled consistently
- **SC-008**: Mobile app can successfully use shared marketplace clients (Amazon, eBay) with platform-specific crypto and HTTP providers, producing identical API interactions as web app
- **SC-009**: Code duplication between web and mobile packages is reduced by at least 60% for marketplace, evaluation, rate limiting, and prompt logic
- **SC-010**: Changes to marketplace, evaluation, rate limiting, or prompt logic require updates in only one location (shared package), reducing maintenance time by at least 50%
- **SC-011**: All existing web app functionality continues to work identically after migration to shared package, with zero regression in behavior
- **SC-012**: Shared package services, rate limiter, AI prompts, and marketplace clients can be unit tested independently without requiring web or mobile platform setup, with test coverage maintained at 80%+
