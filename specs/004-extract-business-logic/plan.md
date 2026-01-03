# Implementation Plan: Extract Business Logic to Shared Package

**Branch**: `004-extract-business-logic` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-extract-business-logic/spec.md`

## Summary

Extract business logic from the web package to the shared package so that both web and mobile applications can use the same marketplace services, evaluation services, listing services, rate limiter, AI prompts, and marketplace clients. This refactoring will reduce code duplication by at least 60% and enable consistent behavior across platforms through dependency injection of platform-specific implementations (crypto, HTTP, logging).

**Phase 0 Complete**: Research completed - all technical decisions resolved.
**Phase 1 Complete**: Data model, contracts, and quickstart documentation generated.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode enabled)
**Primary Dependencies**:
- Shared: OpenAI SDK (^6.10.0), TypeScript (^5)
- Web: Next.js 15, Prisma, Supabase, Sentry
- Mobile: Expo (~54.0.0), React Native (0.81.5), @react-native-async-storage
**Storage**: N/A (this feature is about code organization, not data storage)
**Testing**:
- Shared: Vitest (to be added)
- Web: Vitest + React Testing Library (unit/component), Playwright (E2E)
- Mobile: Jest + React Native Testing Library
**Target Platform**:
- Web: Next.js 15 (Node.js runtime)
- Mobile: Expo/React Native (iOS/Android)
- Shared: Platform-agnostic TypeScript package
**Project Type**: Monorepo (Turborepo) with packages: shared, web, mobile
**Performance Goals**:
- Maintain existing performance (no degradation)
- Shared package must be tree-shakeable
- TypeScript compilation must remain fast (< 5s for shared package)
**Constraints**:
- Must maintain backward compatibility with existing web app
- Must not break existing tests
- Must support dependency injection for platform-specific code
- Shared package must not depend on Node.js-specific APIs (except through abstractions)
**Scale/Scope**:
- ~15 service files to extract
- ~10 type definition files
- ~5 marketplace client files
- ~3 utility files (rate limiter, prompts, errors)
- Both web and mobile packages must consume shared package

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development ✅
- **Status**: PASS
- **Rationale**: All extracted code must have corresponding tests. Existing tests in web package will be migrated to shared package. New tests will be added for mobile-specific scenarios.

### II. TypeScript Strictness ✅
- **Status**: PASS
- **Rationale**: Shared package already uses TypeScript strict mode. All extracted code must maintain strict typing. No `any` types allowed.

### III. Feature Branch Workflow ✅
- **Status**: PASS
- **Rationale**: Working on feature branch `004-extract-business-logic`. All changes will be merged via PR.

### IV. Conventional Commits ✅
- **Status**: PASS
- **Rationale**: All commits will follow Conventional Commits format with appropriate scopes (e.g., `refactor(shared)`, `feat(shared)`).

### V. Component-Based Architecture ✅
- **Status**: PASS (N/A)
- **Rationale**: This feature is about extracting business logic, not UI components. Architecture principle applies to web/mobile packages, not shared package.

### VI. AI Evaluation Transparency ✅
- **Status**: PASS
- **Rationale**: AI prompts and evaluation logic will be extracted to shared package, maintaining version control and transparency. Prompt versioning already exists and will be preserved.

### VII. Marketplace Integration Standards ✅
- **Status**: PASS
- **Rationale**: Rate limiter and marketplace clients will be extracted, ensuring consistent rate limit compliance across platforms. Error handling and retry logic will be preserved.

### VIII. Data Privacy and Security ✅
- **Status**: PASS
- **Rationale**: API keys and credentials will continue to be injected via dependency injection, not hardcoded. No sensitive data will be exposed in shared package.

### IX. Performance Standards ✅
- **Status**: PASS
- **Rationale**: Extraction will not change runtime performance. Shared package will be optimized for tree-shaking. TypeScript compilation will remain fast.

### X. Accessibility Compliance ✅
- **Status**: PASS (N/A)
- **Rationale**: This feature is about business logic extraction, not UI. Accessibility applies to web/mobile packages, not shared package.

**Overall Gate Status**: ✅ **PASS** - All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/004-extract-business-logic/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/
├── shared/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── marketplace/
│   │   │   │   ├── services/
│   │   │   │   │   └── marketplace.service.ts      # Extracted from web
│   │   │   │   ├── clients/
│   │   │   │   │   ├── amazon/
│   │   │   │   │   │   ├── client.ts              # Extracted from web
│   │   │   │   │   │   ├── rapidapi-client.ts     # Extracted from web
│   │   │   │   │   │   └── types.ts               # Extracted from web
│   │   │   │   │   └── ebay/
│   │   │   │   │       ├── client.ts              # Extracted from web
│   │   │   │   │       └── types.ts                # Extracted from web
│   │   │   │   ├── rate-limiter.ts                # Extracted from web
│   │   │   │   └── types.ts                       # Extracted from web
│   │   │   ├── evaluation/
│   │   │   │   ├── services/
│   │   │   │   │   └── evaluation.service.ts      # Extracted from web
│   │   │   │   ├── prompts.ts                     # Extracted from web
│   │   │   │   ├── evaluate-user-listing.ts       # Extracted from web
│   │   │   │   └── types.ts                       # Extracted from web
│   │   │   ├── listing/
│   │   │   │   └── services/
│   │   │   │       └── listing.service.ts         # Extracted from web
│   │   │   ├── errors.ts                          # Extracted from web (platform-agnostic version)
│   │   │   └── interfaces.ts                      # Extracted from web
│   │   └── types/
│   │       └── index.ts                           # Re-exports all types
│   └── __tests__/                                  # Tests for shared package
│
├── web/
│   └── src/
│       └── lib/
│           ├── marketplace/                        # Will import from shared
│           ├── services/                           # Will import from shared
│           ├── ai/                                 # Will import from shared
│           ├── supabase/                           # Platform-specific (stays in web)
│           ├── db/                                 # Platform-specific (stays in web)
│           └── di/                                 # Platform-specific (stays in web)
│
└── mobile/
    └── src/
        └── lib/
            ├── supabase.ts                         # Platform-specific (stays in mobile)
            └── [will import from shared]
```

**Structure Decision**: Monorepo structure with shared package containing extracted business logic. Web and mobile packages will import from shared package. Platform-specific implementations (crypto providers, HTTP clients, logging) will be injected via dependency injection interfaces.

## Complexity Tracking

> **No constitution violations - complexity tracking not needed**
