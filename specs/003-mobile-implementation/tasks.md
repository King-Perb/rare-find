# Tasks: Mobile Implementation (React Native)

**Input**: Design documents from `/specs/003-mobile-implementation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md

**Tests**: Vitest/Jest for unit tests, React Native Testing Library for component tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile project**: `packages/mobile/src/`
- **Shared logic**: `packages/shared/src/`

## Phase 1: Setup (Mobile Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure in `packages/mobile/src/` per implementation plan
- [x] T002 Update `packages/mobile/package.json` with Expo SDK 54/55 and dependencies
- [x] T003 Configure `packages/mobile/app.json` for Expo SDK 55
- [x] T004 Configure TypeScript and Linting for mobile package

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Setup Supabase React Native SDK in `packages/mobile/src/lib/supabase.ts`
- [x] T006 [P] Configure environment variables and `.env` handling in `packages/mobile/`
- [x] T007 Setup Root Layout with Providers (Supabase, Theme, State) in `packages/mobile/src/app/_layout.tsx`
- [x] T008 [P] Import and verify `@rare-find/shared` integration in mobile package
- [x] T009 Implement base Navigation structure (Tabs + Stacks) in `packages/mobile/src/app/(tabs)/_layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Recommendations (Priority: P1) 🎯 MVP

**Goal**: Display a list of AI-generated recommendations with detail views

**Independent Test**: Open app, view list of recommendations, tap to view details. Logic should match web parity.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create Recommendation Card component in `packages/mobile/src/components/recommendations/RecommendationCard.tsx`
- [x] T011 [P] [US1] Create Recommendation List component in `packages/mobile/src/components/recommendations/RecommendationList.tsx`
- [x] T012 [US1] Implement Recommendations index page in `packages/mobile/src/app/(tabs)/index.tsx`
- [x] T013 [US1] Implement Recommendation Detail page in `packages/mobile/src/app/recommendation/[id].tsx`
- [x] T014 [US1] Integrate AI reasoning display from `@rare-find/shared` into detail view

**Checkpoint**: User Story 1 fully functional - core value delivered.

---

## Phase 4: User Story 2 - Real-time Notifications (Priority: P1)

**Goal**: Receive push notifications for new high-confidence bargains

**Independent Test**: Trigger a notification from backend, verify receipt on mobile device.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Implement Push Notification service in `packages/mobile/src/lib/notifications.ts`
- [ ] T016 [US2] Setup Notification permissions request flow in `packages/mobile/src/app/_layout.tsx`
- [ ] T017 [US2] Implement Notification foreground handler
- [ ] T018 [US2] Integrate notification tap action to open recommendation detail

---

## Phase 5: User Story 3 - Mobile Preference Configuration (Priority: P2)

**Goal**: Adjust search preferences from the mobile app

**Independent Test**: Update a category on mobile, verify update in Supabase/Web.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Create Preference Form component in `packages/mobile/src/components/preferences/PreferenceForm.tsx`
- [ ] T020 [US3] Implement Preferences page in `packages/mobile/src/app/(tabs)/preferences.tsx`
- [ ] T021 [US3] Connect preferences to Supabase shared profile

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T022 [P] Implement Branding (Logo, Colors) using React Native Paper theme
- [ ] T023 [P] Add Loading states and Error boundaries for mobile views
- [ ] T024 [P] Performance optimization (list virtualization, image caching)
- [ ] T025 Run full manual verification on iOS and Android simulators

---

## Dependencies & Execution Order

- **Phase 1 & 2**: Mandatory sequence.
- **Phase 3 & 5**: Can run in parallel if foundation is solid.
- **Phase 4**: Depends on Supabase setup from Phase 2.
