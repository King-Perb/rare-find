# Research: Extract Business Logic to Shared Package

**Feature**: 004-extract-business-logic
**Date**: 2026-01-02
**Status**: Complete

## Research Questions

### Q1: Crypto Abstraction for React Native

**Question**: How to abstract Node.js crypto operations (`createHash`, `createHmac`) for use in React Native?

**Decision**: Use interface-based abstraction (`ICryptoProvider`) with platform-specific implementations.

**Rationale**:
- Node.js uses `node:crypto` module which is not available in React Native
- React Native has `expo-crypto` or `react-native-crypto` packages that provide similar functionality
- Interface abstraction allows platform-specific implementations while maintaining shared business logic
- This pattern is commonly used in cross-platform libraries

**Alternatives Considered**:
1. **Use polyfills**: Rejected - polyfills add bundle size and may have compatibility issues
2. **Separate implementations**: Rejected - would duplicate ~300 lines of signature logic, high maintenance burden
3. **Use Web Crypto API**: Rejected - not fully available in React Native, limited HMAC support

**Implementation**:
- Create `ICryptoProvider` interface with `sha256(data: string): string` and `hmacSha256(key: string | Buffer, data: string): Buffer`
- Web implementation: Wrap `node:crypto` functions
- Mobile implementation: Use `expo-crypto` or `react-native-crypto` with same interface

### Q2: HTTP Client Abstraction

**Question**: How to abstract HTTP requests for cross-platform compatibility?

**Decision**: Use interface-based abstraction (`IHttpClient`) with `fetch` as default implementation.

**Rationale**:
- Both Node.js and React Native support `fetch` natively
- `fetch` API is standardized and works consistently across platforms
- Interface abstraction allows for future flexibility (e.g., custom retry logic, interceptors)
- Minimal abstraction overhead since `fetch` is already available

**Alternatives Considered**:
1. **Direct fetch usage**: Rejected - limits flexibility for future requirements (retry logic, interceptors)
2. **Use axios**: Rejected - adds dependency, larger bundle size, not necessary for current needs
3. **Platform-specific HTTP clients**: Rejected - would require separate implementations, defeats purpose of sharing

**Implementation**:
- Create `IHttpClient` interface with `fetch(url: string, options?: RequestInit): Promise<Response>`
- Default implementation: Use native `fetch` (works in both Node.js and React Native)
- Allow platform-specific implementations if needed (e.g., custom retry logic, request interceptors)

### Q3: Logger Abstraction

**Question**: How to abstract logging for cross-platform compatibility?

**Decision**: Use existing `ILogger` interface from web package, implement platform-specific loggers.

**Rationale**:
- `ILogger` interface already exists in web package
- Interface is platform-agnostic (just method signatures)
- Web can use existing logger implementation
- Mobile can implement logger using React Native logging (console, or libraries like `react-native-logs`)

**Alternatives Considered**:
1. **Shared logger implementation**: Rejected - logging destinations differ (Sentry for web, different for mobile)
2. **No abstraction**: Rejected - would require platform-specific service implementations

**Implementation**:
- Extract `ILogger` interface to shared package
- Web: Keep existing logger implementation (can integrate with Sentry)
- Mobile: Implement logger using React Native-compatible logging

### Q4: Error Class Abstraction

**Question**: How to make error classes platform-agnostic?

**Decision**: Remove Sentry-specific code from error classes, keep core error structure.

**Rationale**:
- Error classes (`AppError`, `ValidationError`, etc.) are already mostly platform-agnostic
- Sentry integration should be handled at the platform level, not in shared error classes
- Core error structure (message, statusCode, code, details) is platform-independent

**Alternatives Considered**:
1. **Keep Sentry in shared**: Rejected - Sentry is web-specific, mobile may use different error tracking
2. **Remove error classes**: Rejected - error classes provide type safety and consistent error handling

**Implementation**:
- Extract error classes to shared package without Sentry dependencies
- Web: Wrap shared errors with Sentry integration at service layer
- Mobile: Use shared errors directly or wrap with mobile-specific error tracking

### Q5: Rate Limiter Implementation

**Question**: Is the token bucket algorithm implementation platform-agnostic?

**Decision**: Yes, current implementation is already platform-agnostic.

**Rationale**:
- Rate limiter uses only JavaScript/TypeScript primitives (Date, Map, Promise)
- No platform-specific dependencies
- `setTimeout` is available in both Node.js and React Native
- Algorithm logic is pure business logic

**Implementation**:
- Extract rate limiter as-is to shared package
- No changes needed for cross-platform compatibility

### Q6: AI Prompts Extraction

**Question**: Are AI prompt templates platform-agnostic?

**Decision**: Yes, prompts are pure strings/functions, fully platform-agnostic.

**Rationale**:
- Prompts are just string templates and functions
- No platform-specific dependencies
- Version control and prompt management logic is pure TypeScript

**Implementation**:
- Extract prompts and prompt versioning logic to shared package
- No changes needed

### Q7: TypeScript Project References

**Question**: How to configure TypeScript project references for shared package?

**Decision**: Use TypeScript project references with `composite: true` (already configured).

**Rationale**:
- Shared package already uses `composite: true` in tsconfig.json
- Web package already references shared package in tsconfig.json
- This enables incremental builds and proper type checking
- Mobile package should also reference shared package

**Implementation**:
- Ensure shared package has `composite: true` (already done)
- Ensure web package references shared (already done)
- Add reference in mobile package tsconfig.json

### Q8: Testing Strategy for Shared Package

**Question**: What testing framework to use for shared package?

**Decision**: Use Vitest for shared package tests.

**Rationale**:
- Vitest is fast and works well with TypeScript
- Compatible with both Node.js and can test platform-agnostic code
- Web package already uses Vitest, consistent tooling
- Can mock dependencies easily for testing

**Implementation**:
- Add Vitest to shared package devDependencies
- Migrate existing tests from web package to shared package
- Add new tests for mobile-specific scenarios (with mocked platform dependencies)

## Summary

All research questions resolved. The extraction strategy uses interface-based dependency injection for platform-specific code (crypto, HTTP, logging) while keeping business logic fully shared. TypeScript project references are already configured correctly. Testing will use Vitest for consistency with web package.
