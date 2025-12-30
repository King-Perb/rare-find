# Tasks: Visual Enhancements and Animations

**Input**: Design documents from `/specs/002-visual-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED per constitution (Test-First Development principle). All animation components, hooks, and utilities must have tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `packages/web/src/` at repository root
- Tests: `packages/web/src/components/__tests__/` and `packages/web/e2e/`
- Stories: `packages/web/src/components/**/*.stories.tsx`

## Phase 1: Setup (Animation Infrastructure)

**Purpose**: Create animation infrastructure and directory structure

- [x] T001 Create animation utilities directory structure in packages/web/src/lib/animations/
- [x] T002 Create animation components directory structure in packages/web/src/components/animations/
- [x] T003 [P] Create animation variants file packages/web/src/lib/animations/variants.ts with TypeScript interfaces
- [x] T004 [P] Create transition configurations file packages/web/src/lib/animations/transitions.ts with TypeScript interfaces
- [x] T005 [P] Create animation constants file packages/web/src/lib/animations/constants.ts with timing constants

---

## Phase 2: Foundational (Core Animation Utilities)

**Purpose**: Core animation utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Implement useReducedMotion hook in packages/web/src/hooks/use-reduced-motion.ts to detect prefers-reduced-motion
- [x] T007 [P] Create fade-in animation variants in packages/web/src/lib/animations/variants.ts (fadeIn, fadeInUp, fadeInDown)
- [x] T008 [P] Create slide-in animation variants in packages/web/src/lib/animations/variants.ts (slideInLeft, slideInRight, slideInUp, slideInDown)
- [x] T009 [P] Create scale animation variants in packages/web/src/lib/animations/variants.ts (scaleIn, scaleOut)
- [x] T010 [P] Create stagger animation variants in packages/web/src/lib/animations/variants.ts (staggerContainer, staggerItem)
- [x] T011 [P] Create shake animation variant in packages/web/src/lib/animations/variants.ts for error states
- [x] T012 [P] Create transition configurations in packages/web/src/lib/animations/transitions.ts (default, fast, slow, spring, bounce)
- [x] T013 [P] Create animation timing constants in packages/web/src/lib/animations/constants.ts (FAST_DURATION, DEFAULT_DURATION, SLOW_DURATION, STAGGER_DELAY)
- [x] T014 [P] Write tests for animation variants in packages/web/src/lib/__tests__/animations/variants.test.ts
- [x] T015 [P] Write tests for transition configurations in packages/web/src/lib/__tests__/animations/transitions.test.ts
- [x] T016 [P] Write tests for useReducedMotion hook in packages/web/src/hooks/__tests__/use-reduced-motion.test.ts

**Checkpoint**: Foundation ready - animation utilities available for all user stories

---

## Phase 3: User Story 1 - Smooth Page Load and Initial Experience (Priority: P1) 🎯 MVP

**Goal**: Hero section elements (logo, headline, description, form) appear with smooth fade-in and slide-up animations in sequence, creating a cohesive entrance experience.

**Independent Test**: Load the home page and verify that logo fades in and scales up, headline fades in and slides up, description fades in, and form fades in sequentially. All animations complete within 1 second and maintain 60fps. With reduced motion enabled, animations are disabled.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T017 [P] [US1] Write unit test for hero section entrance animations in packages/web/src/app/__tests__/page.test.tsx
- [x] T018 [P] [US1] Write E2E test for page load animations in packages/web/e2e/animations.spec.ts (hero section sequence)
- [x] T019 [P] [US1] Write E2E test for reduced motion compliance in packages/web/e2e/accessibility.spec.ts (hero section with reduced motion)

### Implementation for User Story 1

- [x] T020 [P] [US1] Create FadeIn animation wrapper component in packages/web/src/components/animations/fade-in.tsx
- [x] T021 [P] [US1] Create SlideIn animation wrapper component in packages/web/src/components/animations/slide-in.tsx
- [x] T022 [US1] Update home page in packages/web/src/app/page.tsx to add entrance animations to logo (fade + scale)
- [x] T023 [US1] Update home page in packages/web/src/app/page.tsx to add entrance animations to headline (fade + slide up)
- [x] T024 [US1] Update home page in packages/web/src/app/page.tsx to add entrance animations to description (fade in with delay)
- [x] T025 [US1] Update home page in packages/web/src/app/page.tsx to add entrance animations to form (fade in with delay)
- [x] T026 [US1] Ensure all hero section animations respect reduced motion in packages/web/src/app/page.tsx
- [x] T027 [P] [US1] Create Storybook story for FadeIn component in packages/web/src/components/animations/fade-in.stories.tsx
- [x] T028 [P] [US1] Create Storybook story for SlideIn component in packages/web/src/components/animations/slide-in.stories.tsx
- [x] T029 [P] [US1] Write tests for FadeIn component in packages/web/src/components/animations/__tests__/fade-in.test.tsx
- [x] T030 [P] [US1] Write tests for SlideIn component in packages/web/src/components/animations/__tests__/slide-in.test.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - hero section has smooth entrance animations that respect reduced motion

---

## Phase 4: User Story 2 - Interactive Form and Button Feedback (Priority: P1)

**Goal**: All interactive elements (buttons, inputs, links) provide immediate visual feedback including hover states, focus animations, click feedback, and loading state transitions. Error states show shake animation.

**Independent Test**: Interact with evaluation form - hover over buttons (scale + shadow), click buttons (scale down + spring back), focus inputs (border color + ring animation), submit form (loading state transition), enter invalid input (shake animation). All feedback occurs within 100ms.

### Tests for User Story 2

- [x] T031 [P] [US2] Write unit test for button hover animations in packages/web/src/components/ui/__tests__/animated-button.test.tsx
- [x] T032 [P] [US2] Write unit test for button click animations in packages/web/src/components/ui/__tests__/animated-button.test.tsx
- [x] T033 [P] [US2] Write unit test for input focus animations in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx
- [x] T034 [P] [US2] Write unit test for error shake animation in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx
- [x] T035 [P] [US2] Write unit test for loading state transitions in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx
- [x] T036 [P] [US2] Write E2E test for form interactions in packages/web/e2e/animations.spec.ts (hover, click, focus, error)

### Implementation for User Story 2

- [x] T037 [P] [US2] Create AnimatedButton component in packages/web/src/components/ui/animated-button.tsx with hover, click, and loading animations
- [x] T038 [US2] Update EvaluationForm component in packages/web/src/components/evaluation/evaluation-form.tsx to add input focus animations (border color + ring)
- [x] T039 [US2] Update EvaluationForm component in packages/web/src/components/evaluation/evaluation-form.tsx to add error shake animation using shake variant
- [x] T040 [US2] Update EvaluationForm component in packages/web/src/components/evaluation/evaluation-form.tsx to add button loading state transitions
- [x] T041 [US2] Replace standard buttons with AnimatedButton in packages/web/src/components/evaluation/evaluation-form.tsx
- [x] T042 [US2] Ensure all form animations respect reduced motion in packages/web/src/components/evaluation/evaluation-form.tsx
- [x] T043 [P] [US2] Create Storybook story for AnimatedButton component in packages/web/src/components/ui/animated-button.stories.tsx with interaction examples
- [x] T044 [P] [US2] Update EvaluationForm Storybook story in packages/web/src/components/evaluation/evaluation-form.stories.tsx with animation interaction examples
- [x] T045 [P] [US2] Write tests for AnimatedButton component in packages/web/src/components/ui/__tests__/animated-button.test.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - page loads with animations and forms provide interactive feedback

---

## Phase 5: User Story 3 - Content Reveal and Results Display (Priority: P2)

**Goal**: Content appears smoothly as it comes into view - results cards slide in, metrics count up, progress bars fill, feature cards stagger on scroll, images fade in.

**Independent Test**: Submit evaluation and verify results cards slide in from right with fade, metrics count up from zero, progress bar fills smoothly, feature cards appear with stagger when scrolled into view, images fade in. All animations complete within 1-2 seconds.

### Tests for User Story 3

- [x] T046 [P] [US3] Write unit test for count-up animation hook in packages/web/src/hooks/__tests__/use-count-up.test.ts
- [x] T047 [P] [US3] Write unit test for scroll-triggered animation hook in packages/web/src/hooks/__tests__/use-scroll-animation.test.ts
- [x] T048 [P] [US3] Write unit test for results reveal animations in packages/web/src/components/evaluation/__tests__/evaluation-results.test.tsx
- [x] T049 [P] [US3] Write unit test for progress bar fill animation in packages/web/src/components/evaluation/__tests__/evaluation-results.test.tsx
- [x] T050 [P] [US3] Write E2E test for scroll-triggered animations in packages/web/e2e/animations.spec.ts (feature cards stagger)
- [x] T051 [P] [US3] Write E2E test for results display animations in packages/web/e2e/animations.spec.ts (cards slide in, metrics count up)

### Implementation for User Story 3

- [x] T052 [P] [US3] Create useCountUp hook in packages/web/src/hooks/use-count-up.ts for number counting animations
- [x] T053 [P] [US3] Create useScrollAnimation hook in packages/web/src/hooks/use-scroll-animation.ts for scroll-triggered animations
- [x] T054 [P] [US3] Create StaggerContainer component in packages/web/src/components/animations/stagger-container.tsx for stagger animations
- [x] T055 [P] [US3] Create ScrollReveal component in packages/web/src/components/animations/scroll-reveal.tsx for scroll-triggered reveals
- [x] T056 [US3] Update EvaluationResults component in packages/web/src/components/evaluation/evaluation-results.tsx to add results card slide-in animations
- [x] T057 [US3] Update EvaluationResults component in packages/web/src/components/evaluation/evaluation-results.tsx to add metric count-up animations using useCountUp hook
- [x] T058 [US3] Update EvaluationResults component in packages/web/src/components/evaluation/evaluation-results.tsx to add progress bar fill animation
- [x] T059 [US3] Update EvaluationResults component in packages/web/src/components/evaluation/evaluation-results.tsx to add image fade-in animations
- [x] T060 [US3] Update home page in packages/web/src/app/page.tsx to add stagger animations to feature cards using StaggerContainer
- [x] T061 [US3] Update home page in packages/web/src/app/page.tsx to add scroll-triggered animations to feature cards using ScrollReveal
- [x] T062 [US3] Ensure all content reveal animations respect reduced motion
- [x] T063 [P] [US3] Create Storybook story for StaggerContainer component in packages/web/src/components/animations/stagger-container.stories.tsx
- [x] T064 [P] [US3] Create Storybook story for ScrollReveal component in packages/web/src/components/animations/scroll-reveal.stories.tsx
- [x] T065 [P] [US3] Update EvaluationResults Storybook story in packages/web/src/components/evaluation/evaluation-results.stories.tsx with animation examples
- [x] T066 [P] [US3] Write tests for StaggerContainer component in packages/web/src/components/animations/__tests__/stagger-container.test.tsx
- [x] T067 [P] [US3] Write tests for ScrollReveal component in packages/web/src/components/animations/__tests__/scroll-reveal.test.tsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - page loads, forms provide feedback, and content reveals smoothly

---

## Phase 6: User Story 4 - Parallax and Depth Effects (Priority: P3)

**Goal**: Subtle depth and parallax effects when scrolling - background elements move slower than foreground, cards have depth effects with shadows, all effects respect reduced motion and maintain 60fps.

**Independent Test**: Scroll through hero section and feature cards, verify background elements move slower than foreground (parallax), cards have depth effects with shadows, reduced motion disables parallax, performance remains at 60fps.

### Tests for User Story 4

- [ ] T068 [P] [US4] Write unit test for parallax background component in packages/web/src/components/animations/__tests__/parallax-background.test.tsx
- [ ] T069 [P] [US4] Write E2E test for parallax effects in packages/web/e2e/animations.spec.ts (scroll parallax, depth effects)
- [ ] T070 [P] [US4] Write E2E test for parallax reduced motion compliance in packages/web/e2e/accessibility.spec.ts

### Implementation for User Story 4

- [x] T071 [P] [US4] Create ParallaxBackground component in packages/web/src/components/animations/parallax-background.tsx using Framer Motion useScroll hook
- [x] T072 [US4] Update home page in packages/web/src/app/page.tsx to add parallax background to hero section using ParallaxBackground component
- [ ] T073 [US4] Update home page in packages/web/src/app/page.tsx to add depth effects to feature cards (shadows that respond to scroll)
- [ ] T074 [US4] Ensure parallax effects respect reduced motion and are disabled when enabled
- [ ] T075 [US4] Optimize parallax performance to maintain 60fps (use transform, debounce scroll)
- [ ] T076 [P] [US4] Create Storybook story for ParallaxBackground component in packages/web/src/components/animations/parallax-background.stories.tsx
- [ ] T077 [P] [US4] Write tests for ParallaxBackground component in packages/web/src/components/animations/__tests__/parallax-background.test.tsx

**Checkpoint**: At this point, all user stories should be complete - full animation experience with parallax effects

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, Storybook updates, brandbook updates, performance optimization, and final polish

- [ ] T078 [P] Update brandbook page in packages/web/src/app/design/page.tsx with Animations section (patterns, timing, variants, usage guidelines)
- [ ] T079 [P] Update LoadingSpinner Storybook story in packages/web/src/components/ui/loading-spinner.stories.tsx with enhanced animation examples
- [ ] T080 [P] Update ErrorDisplay Storybook story in packages/web/src/components/ui/error-display.stories.tsx with animation examples if applicable
- [ ] T081 [P] Add animation performance monitoring and verify 60fps target is met
- [ ] T082 [P] Verify bundle size increase is under 50KB (gzipped) using bundle analyzer
- [ ] T083 [P] Verify page load time increase is under 200ms using Lighthouse
- [ ] T084 [P] Verify CLS score remains under 0.1 (no layout shifts during animations)
- [ ] T085 [P] Run all unit tests and ensure 100% pass rate for animation components
- [ ] T086 [P] Run all E2E tests and ensure 100% pass rate for animation scenarios
- [ ] T087 [P] Verify all Storybook stories render correctly and pass accessibility checks
- [ ] T088 [P] Test all animations with reduced motion enabled and verify compliance
- [ ] T089 [P] Test all animations on low-performance devices and verify 60fps performance
- [ ] T090 [P] Update quickstart.md validation - verify all code examples work correctly
- [ ] T091 Code cleanup and refactoring - ensure consistent animation patterns across components
- [ ] T092 [P] Documentation updates - ensure all animation components have JSDoc comments

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (US1 → US2 → US3 → US4)
  - US1 and US2 (both P1) can be worked on in parallel if team capacity allows
  - US3 (P2) can start after US1/US2 complete or in parallel if no dependencies
  - US4 (P3) can start after US3 or in parallel if no dependencies
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (can run parallel with US1)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Uses animation utilities from US1/US2 but can be implemented independently
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Uses animation utilities but can be implemented independently

### Within Each User Story

- Tests MUST be written and FAIL before implementation (test-first development)
- Animation components before integration into pages
- Core animation components before Storybook stories
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - User Story 1 and User Story 2 can start in parallel (both P1, no dependencies)
  - User Story 3 can start after US1/US2 or in parallel if team capacity allows
  - User Story 4 can start after US3 or in parallel if team capacity allows
- All tests for a user story marked [P] can run in parallel
- Animation components within a story marked [P] can run in parallel
- Storybook stories marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all animation wrapper components together:
Task: "Create FadeIn animation wrapper component in packages/web/src/components/animations/fade-in.tsx"
Task: "Create SlideIn animation wrapper component in packages/web/src/components/animations/slide-in.tsx"

# Launch all tests together:
Task: "Write unit test for hero section entrance animations in packages/web/src/app/__tests__/page.test.tsx"
Task: "Write E2E test for page load animations in packages/web/e2e/animations.spec.ts"
Task: "Write E2E test for reduced motion compliance in packages/web/e2e/accessibility.spec.ts"

# Launch all Storybook stories together:
Task: "Create Storybook story for FadeIn component in packages/web/src/components/animations/fade-in.stories.tsx"
Task: "Create Storybook story for SlideIn component in packages/web/src/components/animations/slide-in.stories.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch all tests together:
Task: "Write unit test for button hover animations in packages/web/src/components/ui/__tests__/animated-button.test.tsx"
Task: "Write unit test for button click animations in packages/web/src/components/ui/__tests__/animated-button.test.tsx"
Task: "Write unit test for input focus animations in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx"
Task: "Write unit test for error shake animation in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx"
Task: "Write unit test for loading state transitions in packages/web/src/components/evaluation/__tests__/evaluation-form.test.tsx"
```

## Parallel Example: Foundational Phase

```bash
# Launch all animation variant creation together:
Task: "Create fade-in animation variants in packages/web/src/lib/animations/variants.ts"
Task: "Create slide-in animation variants in packages/web/src/lib/animations/variants.ts"
Task: "Create scale animation variants in packages/web/src/lib/animations/variants.ts"
Task: "Create stagger animation variants in packages/web/src/lib/animations/variants.ts"
Task: "Create shake animation variant in packages/web/src/lib/animations/variants.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Smooth Page Load)
4. **STOP and VALIDATE**: Test User Story 1 independently - hero section has entrance animations
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - smooth page load!)
3. Add User Story 2 → Test independently → Deploy/Demo (Interactive feedback!)
4. Add User Story 3 → Test independently → Deploy/Demo (Content reveal!)
5. Add User Story 4 → Test independently → Deploy/Demo (Parallax effects!)
6. Add Polish → Final polish and documentation
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Page Load Animations)
   - Developer B: User Story 2 (Form Feedback) - can start in parallel
   - Developer C: User Story 3 (Content Reveal) - can start after US1/US2 or in parallel
   - Developer D: User Story 4 (Parallax) - can start after US3 or in parallel
3. Stories complete and integrate independently
4. All developers: Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (test-first development)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All animations must respect `prefers-reduced-motion`
- All animations must maintain 60fps performance
- All animation components must have Storybook stories
- Brandbook must be updated with animation patterns
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

**Total Tasks**: 92 tasks

**Tasks by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 11 tasks
- Phase 3 (User Story 1): 14 tasks
- Phase 4 (User Story 2): 15 tasks
- Phase 5 (User Story 3): 22 tasks
- Phase 6 (User Story 4): 10 tasks
- Phase 7 (Polish): 15 tasks

**Tasks by User Story**:
- User Story 1 (P1): 14 tasks
- User Story 2 (P1): 15 tasks
- User Story 3 (P2): 22 tasks
- User Story 4 (P3): 10 tasks

**Parallel Opportunities**: 68 tasks marked [P] can run in parallel

**Independent Test Criteria**:
- **US1**: Load home page, verify hero section entrance animations complete within 1s at 60fps, reduced motion disables animations
- **US2**: Interact with form, verify hover/click/focus/error animations provide feedback within 100ms
- **US3**: Submit evaluation, verify results slide in, metrics count up, progress bars fill, feature cards stagger on scroll
- **US4**: Scroll page, verify parallax effects, depth effects, reduced motion compliance, 60fps performance

**Suggested MVP Scope**: Phase 1 + Phase 2 + Phase 3 (User Story 1 only) = 30 tasks
- Provides smooth page load animations
- Establishes animation infrastructure
- Can be deployed and demoed independently
