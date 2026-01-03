# Tasks: Extract Business Logic to Shared Package

**Input**: Design documents from `/specs/004-extract-business-logic/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per constitution requirements (test-first development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize shared package structure and testing infrastructure

- [x] T001 Create directory structure for shared package lib in packages/shared/src/lib/marketplace/services/
- [x] T002 Create directory structure for shared package lib in packages/shared/src/lib/marketplace/clients/amazon/
- [x] T003 [P] Create directory structure for shared package lib in packages/shared/src/lib/marketplace/clients/ebay/
- [x] T004 [P] Create directory structure for shared package lib in packages/shared/src/lib/evaluation/services/
- [x] T005 [P] Create directory structure for shared package lib in packages/shared/src/lib/listing/services/
- [x] T006 [P] Add Vitest to shared package devDependencies in packages/shared/package.json
- [x] T007 [P] Create Vitest configuration file in packages/shared/vitest.config.ts
- [x] T008 [P] Create test directory structure in packages/shared/__tests__/marketplace/
- [x] T009 [P] Create test directory structure in packages/shared/__tests__/evaluation/
- [x] T010 [P] Create test directory structure in packages/shared/__tests__/listing/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core interfaces, error classes, and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Extract ILogger interface to packages/shared/src/lib/interfaces.ts from packages/web/src/lib/services/interfaces.ts
- [x] T012 [P] Create ICryptoProvider interface in packages/shared/src/lib/interfaces.ts
- [x] T013 [P] Create IHttpClient interface in packages/shared/src/lib/interfaces.ts
- [x] T014 [P] Extract IMarketplaceService interface to packages/shared/src/lib/interfaces.ts from packages/web/src/lib/services/interfaces.ts
- [x] T015 [P] Extract IEvaluationService interface to packages/shared/src/lib/interfaces.ts from packages/web/src/lib/services/interfaces.ts
- [x] T016 [P] Extract IListingService interface to packages/shared/src/lib/interfaces.ts from packages/web/src/lib/services/interfaces.ts
- [x] T017 Extract AppError base class to packages/shared/src/lib/errors.ts from packages/web/src/lib/errors.ts (remove Sentry dependency)
- [x] T018 [P] Extract ValidationError class to packages/shared/src/lib/errors.ts from packages/web/src/lib/errors.ts
- [x] T019 [P] Extract NotFoundError class to packages/shared/src/lib/errors.ts from packages/web/src/lib/errors.ts
- [x] T020 [P] Extract UnauthorizedError class to packages/shared/src/lib/errors.ts from packages/web/src/lib/errors.ts
- [x] T021 [P] Extract RateLimitError class to packages/shared/src/lib/errors.ts from packages/web/src/lib/errors.ts
- [x] T022 Extract marketplace types (MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult, Marketplace, MarketplaceClient) to packages/shared/src/lib/marketplace/types.ts from packages/web/src/lib/marketplace/types.ts
- [x] T023 [P] Export all interfaces from packages/shared/src/lib/interfaces.ts
- [x] T024 [P] Export all error classes from packages/shared/src/lib/errors.ts
- [x] T025 [P] Update packages/shared/src/lib/index.ts to export interfaces and errors

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Mobile App Uses Shared Marketplace Logic (Priority: P1) 🎯 MVP

**Goal**: Extract marketplace service (URL parsing, listing fetching) to shared package so mobile can use it

**Independent Test**: Import marketplace service from shared package in mobile app and verify it can parse URLs and fetch listings identically to web app

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T026 [P] [US1] Create test for MarketplaceService.parseMarketplaceUrl in packages/shared/__tests__/marketplace/marketplace-service.test.ts
- [x] T027 [P] [US1] Create test for MarketplaceService.fetchListingFromUrl in packages/shared/__tests__/marketplace/marketplace-service.test.ts
- [x] T028 [P] [US1] Create test for MarketplaceService.getListingById in packages/shared/__tests__/marketplace/marketplace-service.test.ts
- [x] T029 [P] [US1] Create test for MarketplaceService.search in packages/shared/__tests__/marketplace/marketplace-service.test.ts

### Implementation for User Story 1

- [x] T030 [US1] Extract MarketplaceService class to packages/shared/src/lib/marketplace/services/marketplace.service.ts from packages/web/src/lib/services/marketplace.service.ts
- [x] T031 [US1] Update MarketplaceService constructor to accept ILogger, ICryptoProvider, IHttpClient via dependency injection in packages/shared/src/lib/marketplace/services/marketplace.service.ts
- [x] T032 [US1] Remove platform-specific dependencies (node:crypto, direct fetch) from MarketplaceService in packages/shared/src/lib/marketplace/services/marketplace.service.ts
- [x] T033 [US1] Update MarketplaceService to use injected crypto and HTTP providers in packages/shared/src/lib/marketplace/services/marketplace.service.ts
- [x] T034 [US1] Export MarketplaceService from packages/shared/src/lib/marketplace/services/index.ts
- [x] T035 [US1] Update packages/shared/src/lib/index.ts to export marketplace services

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mobile App Uses Shared Listing Validation Logic (Priority: P1)

**Goal**: Extract listing validation and normalization service to shared package so mobile can use it

**Independent Test**: Import listing service from shared package in mobile app and verify it validates and normalizes listing data identically to web app

### Tests for User Story 2

- [x] T036 [P] [US2] Create test for ListingService.validateListing in packages/shared/__tests__/listing/listing-service.test.ts
- [x] T037 [P] [US2] Create test for ListingService.normalizeListing in packages/shared/__tests__/listing/listing-service.test.ts

### Implementation for User Story 2

- [x] T038 [US2] Extract ListingService class to packages/shared/src/lib/listing/services/listing.service.ts from packages/web/src/lib/services/listing.service.ts
- [x] T039 [US2] Update ListingService constructor to accept ILogger via dependency injection in packages/shared/src/lib/listing/services/listing.service.ts
- [x] T040 [US2] Export ListingService from packages/shared/src/lib/listing/services/index.ts
- [x] T041 [US2] Update packages/shared/src/lib/index.ts to export listing services

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mobile App Uses Shared AI Evaluation Logic (Priority: P2)

**Goal**: Extract AI evaluation service to shared package so mobile can use it

**Independent Test**: Import evaluation service from shared package in mobile app and verify it produces the same evaluation results for the same listing input as web app

### Tests for User Story 3

- [x] T042 [P] [US3] Create test for EvaluationService.evaluateListing in packages/shared/__tests__/evaluation/evaluation-service.test.ts
- [x] T043 [P] [US3] Create test for evaluateUserListing function in packages/shared/__tests__/evaluation/evaluate-user-listing.test.ts

### Implementation for User Story 3

- [x] T044 [US3] Extract EvaluationService class to packages/shared/src/lib/evaluation/services/evaluation.service.ts from packages/web/src/lib/services/evaluation.service.ts
- [x] T045 [US3] Update EvaluationService constructor to accept ILogger via dependency injection in packages/shared/src/lib/evaluation/services/evaluation.service.ts
- [x] T046 [US3] Extract evaluateUserListing function to packages/shared/src/lib/evaluation/evaluate-user-listing.ts from packages/web/src/lib/ai/evaluate-user-listing.ts
- [x] T047 [US3] Update evaluateUserListing to accept OpenAI client via dependency injection (not from env) in packages/shared/src/lib/evaluation/evaluate-user-listing.ts
- [x] T048 [US3] Extract evaluation types (EvaluationInput, EvaluationResult, AIEvaluationResponse, etc.) to packages/shared/src/lib/evaluation/types.ts from packages/web/src/lib/ai/types.ts
- [x] T049 [US3] Export EvaluationService from packages/shared/src/lib/evaluation/services/index.ts
- [x] T050 [US3] Update packages/shared/src/lib/index.ts to export evaluation services and types

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Mobile App Uses Shared Rate Limiting Logic (Priority: P2)

**Goal**: Extract rate limiter to shared package so mobile can use it

**Independent Test**: Import rate limiter from shared package in mobile app and verify it enforces the same rate limits (Amazon PA-API: 1 req/sec, eBay: ~0.058 req/sec) as web app

### Tests for User Story 4

- [x] T051 [P] [US4] Create test for MarketplaceRateLimiter.canMakeRequest in packages/shared/__tests__/marketplace/rate-limiter.test.ts
- [x] T052 [P] [US4] Create test for MarketplaceRateLimiter.waitAndConsume in packages/shared/__tests__/marketplace/rate-limiter.test.ts
- [x] T053 [P] [US4] Create test for MarketplaceRateLimiter.getWaitTime in packages/shared/__tests__/marketplace/rate-limiter.test.ts

### Implementation for User Story 4

- [x] T054 [US4] Extract MarketplaceRateLimiter class to packages/shared/src/lib/marketplace/rate-limiter.ts from packages/web/src/lib/marketplace/rate-limiter.ts
- [x] T055 [US4] Extract getRateLimiter function to packages/shared/src/lib/marketplace/rate-limiter.ts from packages/web/src/lib/marketplace/rate-limiter.ts
- [x] T056 [US4] Extract waitForRateLimit function to packages/shared/src/lib/marketplace/rate-limiter.ts from packages/web/src/lib/marketplace/rate-limiter.ts
- [x] T057 [US4] Extract RateLimitSource type to packages/shared/src/lib/marketplace/rate-limiter.ts from packages/web/src/lib/marketplace/rate-limiter.ts
- [x] T058 [US4] Export rate limiter functions and types from packages/shared/src/lib/marketplace/rate-limiter.ts
- [x] T059 [US4] Update packages/shared/src/lib/index.ts to export rate limiter

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently

---

## Phase 7: User Story 5 - Mobile App Uses Shared AI Prompts (Priority: P2)

**Goal**: Extract AI prompt templates to shared package so mobile can use them

**Independent Test**: Import AI prompts from shared package in mobile app and verify it uses the same prompt templates and versions as web app

### Tests for User Story 5

- [x] T060 [P] [US5] Create test for prompt version constants in packages/shared/__tests__/evaluation/prompts.test.ts
- [x] T061 [P] [US5] Create test for getEvaluationPrompt function in packages/shared/__tests__/evaluation/prompts.test.ts

### Implementation for User Story 5

- [x] T062 [US5] Extract PROMPT_VERSION constant to packages/shared/src/lib/evaluation/prompts.ts from packages/web/src/lib/ai/prompts.ts
- [x] T063 [US5] Extract MODEL_VERSION constant to packages/shared/src/lib/evaluation/prompts.ts from packages/web/src/lib/ai/prompts.ts
- [x] T064 [US5] Extract getEvaluationPrompt function to packages/shared/src/lib/evaluation/prompts.ts from packages/web/src/lib/ai/prompts.ts
- [x] T065 [US5] Update MODEL_VERSION to accept model from parameter (not env) in packages/shared/src/lib/evaluation/prompts.ts
- [x] T066 [US5] Export prompts and constants from packages/shared/src/lib/evaluation/prompts.ts
- [x] T067 [US5] Update packages/shared/src/lib/index.ts to export prompts

**Checkpoint**: At this point, User Stories 1, 2, 3, 4, AND 5 should all work independently

---

## Phase 8: User Story 6 - Mobile App Uses Shared Marketplace Clients (Priority: P2)

**Goal**: Extract marketplace API clients (Amazon, eBay) to shared package with crypto/HTTP abstraction so mobile can use them

**Independent Test**: Import marketplace clients from shared package in mobile app with platform-specific crypto and HTTP providers, and verify it produces identical API requests and handles responses the same way as web app

### Tests for User Story 6

- [x] T068 [P] [US6] Create test for AmazonClient.search with mocked crypto and HTTP providers in packages/shared/__tests__/marketplace/clients/amazon-client.test.ts
- [x] T069 [P] [US6] Create test for AmazonClient.getItemById with mocked crypto and HTTP providers in packages/shared/__tests__/marketplace/clients/amazon-client.test.ts
- [x] T070 [P] [US6] Create test for eBayClient.search with mocked HTTP provider in packages/shared/__tests__/marketplace/clients/ebay-client.test.ts
- [x] T071 [P] [US6] Create test for eBayClient.getItemById with mocked HTTP provider in packages/shared/__tests__/marketplace/clients/ebay-client.test.ts

### Implementation for User Story 6

- [x] T072 [US6] Extract AmazonClient class to packages/shared/src/lib/marketplace/clients/amazon/client.ts from packages/web/src/lib/marketplace/amazon/client.ts
- [x] T073 [US6] Update AmazonClient constructor to accept ICryptoProvider and IHttpClient via dependency injection in packages/shared/src/lib/marketplace/clients/amazon/client.ts
- [x] T074 [US6] Replace node:crypto calls with ICryptoProvider methods in AmazonClient in packages/shared/src/lib/marketplace/clients/amazon/client.ts
- [x] T075 [US6] Replace fetch calls with IHttpClient.fetch in AmazonClient in packages/shared/src/lib/marketplace/clients/amazon/client.ts
- [x] T076 [US6] Extract AmazonClient types to packages/shared/src/lib/marketplace/clients/amazon/types.ts from packages/web/src/lib/marketplace/amazon/types.ts
- [x] T077 [US6] Extract RapidAPIAmazonClient class to packages/shared/src/lib/marketplace/clients/amazon/rapidapi-client.ts from packages/web/src/lib/marketplace/amazon/rapidapi-client.ts
- [x] T078 [US6] Update RapidAPIAmazonClient to use IHttpClient in packages/shared/src/lib/marketplace/clients/amazon/rapidapi-client.ts
- [x] T079 [US6] Extract RapidAPI types to packages/shared/src/lib/marketplace/clients/amazon/rapidapi-types.ts from packages/web/src/lib/marketplace/amazon/rapidapi-types.ts
- [x] T080 [US6] Extract eBayClient class to packages/shared/src/lib/marketplace/clients/ebay/client.ts from packages/web/src/lib/marketplace/ebay/client.ts
- [x] T081 [US6] Update eBayClient constructor to accept IHttpClient via dependency injection in packages/shared/src/lib/marketplace/clients/ebay/client.ts
- [x] T082 [US6] Replace fetch calls with IHttpClient.fetch in eBayClient in packages/shared/src/lib/marketplace/clients/ebay/client.ts
- [x] T083 [US6] Extract eBayClient types to packages/shared/src/lib/marketplace/clients/ebay/types.ts from packages/web/src/lib/marketplace/ebay/types.ts
- [x] T084 [US6] Export all marketplace clients from packages/shared/src/lib/marketplace/clients/index.ts
- [x] T085 [US6] Update packages/shared/src/lib/index.ts to export marketplace clients

**Checkpoint**: At this point, User Stories 1, 2, 3, 4, 5, AND 6 should all work independently

---

## Phase 9: User Story 7 - Developers Use Shared Types and Interfaces (Priority: P2)

**Goal**: Ensure all types and interfaces are properly exported and organized in shared package

**Independent Test**: Import types and interfaces from shared package in both web and mobile apps and verify TypeScript compilation succeeds with consistent types

### Implementation for User Story 7

- [x] T086 [US7] Organize all type exports in packages/shared/src/types/index.ts
- [x] T087 [US7] Ensure MarketplaceListing type is exported from packages/shared/src/types/index.ts
- [x] T088 [US7] Ensure EvaluationResult type is exported from packages/shared/src/types/index.ts
- [x] T089 [US7] Ensure all service interfaces are exported from packages/shared/src/lib/interfaces.ts
- [x] T090 [US7] Update packages/shared/src/index.ts to re-export all types from packages/shared/src/types/index.ts
- [x] T091 [US7] Verify TypeScript project references are configured in packages/web/tsconfig.json
- [x] T092 [US7] Add TypeScript project reference to shared package in packages/mobile/tsconfig.json

**Checkpoint**: At this point, all user stories should be complete and types/interfaces properly exported

---

## Phase 10: Web Package Migration

**Purpose**: Update web package to use shared package instead of local implementations

- [x] T093 Create NodeCryptoProvider implementation in packages/web/src/lib/crypto/node-crypto-provider.ts
- [x] T094 [P] Create WebHttpClient implementation (wrapper around fetch) in packages/web/src/lib/http/web-http-client.ts
- [x] T095 [P] Update web package DI container to use shared services in packages/web/src/lib/di/setup.ts
- [x] T096 [P] Update MarketplaceService imports in web package to use shared package in packages/web/src/lib/services/marketplace.service.ts
- [x] T097 [P] Update ListingService imports in web package to use shared package in packages/web/src/lib/services/listing.service.ts
- [x] T098 [P] Update EvaluationService imports in web package to use shared package in packages/web/src/lib/services/evaluation.service.ts
- [x] T099 [P] Update marketplace client imports in web package to use shared package in packages/web/src/lib/marketplace/amazon/client.ts
- [x] T100 [P] Update marketplace client imports in web package to use shared package in packages/web/src/lib/marketplace/ebay/client.ts
- [x] T101 [P] Update rate limiter imports in web package to use shared package in packages/web/src/lib/marketplace/rate-limiter.ts
- [x] T102 [P] Update AI prompts imports in web package to use shared package in packages/web/src/lib/ai/prompts.ts
- [x] T103 [P] Update error class imports in web package to use shared package in packages/web/src/lib/errors.ts
- [x] T104 Migrate web package tests to use shared package mocks in packages/web/src/lib/services/__tests__/
- [x] T105 Verify all web package tests pass after migration
- [x] T106 Remove extracted files from web package (marketplace services, clients, rate limiter, prompts, evaluation service, listing service)

---

## Phase 11: Mobile Package Integration

**Purpose**: Enable mobile package to use shared package

- [ ] T107 Create ExpoCryptoProvider implementation in packages/mobile/src/lib/crypto/expo-crypto-provider.ts
- [ ] T108 [P] Create MobileHttpClient implementation (wrapper around fetch) in packages/mobile/src/lib/http/mobile-http-client.ts
- [ ] T109 [P] Create MobileLogger implementation in packages/mobile/src/lib/logger/mobile-logger.ts
- [ ] T110 [P] Add expo-crypto dependency to packages/mobile/package.json
- [ ] T111 Create example usage of MarketplaceService in mobile package in packages/mobile/src/lib/examples/marketplace-usage.ts
- [ ] T112 Create example usage of EvaluationService in mobile package in packages/mobile/src/lib/examples/evaluation-usage.ts
- [ ] T113 Verify mobile package TypeScript compilation succeeds with shared package imports
- [ ] T114 Verify mobile package can import and use all shared services

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

- [ ] T115 [P] Update shared package README with usage examples in packages/shared/README.md
- [ ] T116 [P] Verify all shared package exports are documented in packages/shared/src/index.ts
- [ ] T117 [P] Run quickstart.md validation scenarios from specs/004-extract-business-logic/quickstart.md
- [ ] T118 [P] Ensure test coverage is maintained at 80%+ for shared package
- [ ] T119 [P] Verify code duplication reduction metric (target: 60%+ reduction)
- [ ] T120 [P] Update implementation plan documentation in doc/implementation_plan.md (if exists)
- [ ] T121 Verify all existing web app functionality works identically after migration
- [ ] T122 Run full test suite for web package to ensure zero regression
- [ ] T123 Run type check for all packages to ensure no TypeScript errors
- [ ] T124 Run lint check for all packages to ensure no linting errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2)
  - US1 and US2 (both P1) can be done in parallel after foundational
  - US3-US7 (all P2) can be done in parallel after US1 and US2
- **Web Migration (Phase 10)**: Depends on all user stories (Phase 3-9) completion
- **Mobile Integration (Phase 11)**: Depends on all user stories (Phase 3-9) completion, can run in parallel with Phase 10
- **Polish (Phase 12)**: Depends on Phase 10 and Phase 11 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories, can run in parallel with US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US5 (prompts) for full functionality
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies, can run in parallel
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - No dependencies, should complete before US3
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 (marketplace service uses clients)
- **User Story 7 (P2)**: Can start after Foundational (Phase 2) - Mostly organizational, can run in parallel

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core implementation before integration
- Export organization after implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - US1 and US2 (both P1) can start in parallel
  - US4, US5, US7 (P2) can start in parallel
  - US3 should wait for US5 (prompts)
  - US6 should wait for US1 (marketplace service)
- All tests for a user story marked [P] can run in parallel
- Web Migration (Phase 10) and Mobile Integration (Phase 11) can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create test for MarketplaceService.parseMarketplaceUrl in packages/shared/__tests__/marketplace/marketplace-service.test.ts"
Task: "Create test for MarketplaceService.fetchListingFromUrl in packages/shared/__tests__/marketplace/marketplace-service.test.ts"
Task: "Create test for MarketplaceService.getListingById in packages/shared/__tests__/marketplace/marketplace-service.test.ts"
Task: "Create test for MarketplaceService.search in packages/shared/__tests__/marketplace/marketplace-service.test.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Marketplace Logic)
4. Complete Phase 4: User Story 2 (Listing Validation)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 2 (P1) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 5 (Prompts) → Test independently
4. Add User Story 3 (Evaluation) → Test independently → Deploy/Demo
5. Add User Story 4 (Rate Limiting) → Test independently → Deploy/Demo
6. Add User Story 6 (Clients) → Test independently → Deploy/Demo
7. Add User Story 7 (Types) → Test independently → Deploy/Demo
8. Migrate web package → Test → Deploy
9. Integrate mobile package → Test → Deploy
10. Polish and finalize

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Marketplace Logic)
   - Developer B: User Story 2 (Listing Validation)
3. Once US1 and US2 complete:
   - Developer A: User Story 5 (Prompts)
   - Developer B: User Story 4 (Rate Limiting)
   - Developer C: User Story 7 (Types)
4. Once US5 completes:
   - Developer A: User Story 3 (Evaluation)
   - Developer B: User Story 6 (Clients)
5. Once all stories complete:
   - Developer A: Web Migration
   - Developer B: Mobile Integration
   - Developer C: Polish & Documentation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- US3 depends on US5 (evaluation needs prompts) - complete US5 first
- US6 depends on US1 (clients used by marketplace service) - complete US1 first
