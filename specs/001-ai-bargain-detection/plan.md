# Implementation Plan: AI-Powered Bargain Detection System

**Branch**: `001-ai-bargain-detection` | **Date**: 2025-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-bargain-detection/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an AI-powered bargain detection system that searches Amazon and eBay for undervalued antique and collectible items, evaluates listings using AI to determine undervaluation, and delivers buy recommendations to users. The system uses Next.js 15 with TypeScript, integrates with marketplace APIs (Amazon Product Advertising API, eBay Finding API), and leverages OpenAI for intelligent listing evaluation.

## Technical Context

**Language/Version**: TypeScript 5+ (strict mode enabled)  
**Primary Dependencies**: Next.js 16.0.10, React 19.2.0, OpenAI SDK 6.10.0, Tailwind CSS v4, shadcn/ui components  
**Storage**: Supabase (PostgreSQL) - Serverless PostgreSQL database with built-in authentication, real-time subscriptions, and row-level security. Supports both web and React Native via Supabase client SDKs.  
**Testing**: Vitest 4.0.16, React Testing Library, Playwright 1.57.0  
**Target Platform**: Web application (browser-based, responsive design) with React Native mobile app planned for future  
**Project Type**: Web application (Next.js App Router with API routes)  
**Performance Goals**: 
- AI evaluation response time < 5s per listing
- Marketplace search results load < 2s
- Recommendation list renders < 2s
- Support 100+ concurrent users evaluating listings
- Process 1000+ listings per day per user

**Constraints**: 
- Must respect Amazon Product Advertising API rate limits (1 request per second per IP)
- Must respect eBay Finding API rate limits (varies by endpoint, typically 5000 calls per day)
- AI evaluation costs must be optimized (batch processing, caching)
- All marketplace API credentials must be stored securely (server-side only)
- User data and preferences must be encrypted at rest
- Must handle API failures gracefully with retry logic

**Scale/Scope**: 
- MVP: Single user per account (multi-user/shared accounts out of scope)
- Support up to 50 active search preferences per user
- Support up to 1000 recommendations per user
- Process listings from Amazon and eBay marketplaces
- Focus on antique, collectible, and high-value object categories
- Real-time recommendation delivery (within 1 hour of listing detection)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Test-First Development (NON-NEGOTIABLE)
✅ **PASS**: Vitest and React Testing Library specified. All code changes will include tests. AI evaluation and marketplace integration will have dedicated test suites with mocked responses.

### II. TypeScript Strictness
✅ **PASS**: TypeScript strict mode enabled. All marketplace API responses and AI evaluation results will be fully typed. Types defined in `src/types/`.

### III. Feature Branch Workflow (NON-NEGOTIABLE)
✅ **PASS**: Currently on feature branch `001-ai-bargain-detection`. All changes will be made on this branch and merged via pull request.

### IV. Conventional Commits
✅ **PASS**: Will use conventional commits with scopes: `ai`, `marketplace`, `recommendations`, `components`, `api`.

### V. Component-Based Architecture
✅ **PASS**: Using shadcn/ui for base components. Feature components will be organized in `src/components/recommendations/`, `src/components/preferences/`, etc.

### VI. AI Evaluation Transparency
✅ **PASS**: AI evaluation results will include confidence scores, reasoning factors, and estimated market value. Evaluation prompts will be version-controlled. Fallback mechanisms will be implemented for AI failures.

### VII. Marketplace Integration Standards
✅ **PASS**: Will implement rate limit compliance, retry logic, error handling, and API response caching. All API interactions will be logged for debugging.

### VIII. Data Privacy and Security
✅ **PASS**: API keys will be stored server-side only. User preferences and recommendations will be encrypted at rest. All external API calls will use HTTPS.

### IX. Performance Standards
✅ **PASS**: Performance targets defined above meet constitution requirements. Will implement caching, lazy loading, and optimized AI evaluation calls.

### X. Accessibility Compliance
✅ **PASS**: Will use semantic HTML, ARIA labels, keyboard navigation, and meet WCAG 2.1 Level AA standards.

**GATE RESULT**: ✅ **ALL CHECKS PASS** - Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-bargain-detection/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web application structure (Next.js App Router)

src/
├── app/
│   ├── api/
│   │   ├── recommendations/
│   │   │   ├── route.ts              # GET recommendations, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE single recommendation
│   │   │       └── mark-purchased/
│   │   │           └── route.ts      # POST mark as purchased
│   │   ├── preferences/
│   │   │   └── route.ts              # GET, POST, PATCH user preferences
│   │   ├── marketplace/
│   │   │   ├── search/
│   │   │   │   └── route.ts          # POST trigger search
│   │   │   └── evaluate/
│   │   │       └── route.ts          # POST evaluate listing with AI
│   │   └── webhooks/
│   │       └── route.ts              # POST marketplace webhooks (future)
│   ├── (dashboard)/
│   │   ├── recommendations/
│   │   │   ├── page.tsx               # Recommendations list page
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Recommendation detail page
│   │   ├── preferences/
│   │   │   └── page.tsx               # User preferences configuration
│   │   └── layout.tsx                 # Dashboard layout
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home/landing page
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── recommendations/
│   │   ├── recommendation-card.tsx
│   │   ├── recommendation-list.tsx
│   │   ├── recommendation-detail.tsx
│   │   └── ai-evaluation-display.tsx
│   ├── preferences/
│   │   ├── preference-form.tsx
│   │   └── category-selector.tsx
│   └── layout/
│       ├── header.tsx
│       └── sidebar.tsx
├── lib/
│   ├── ai/
│   │   ├── evaluate-listing.ts        # AI evaluation logic
│   │   ├── prompts.ts                 # AI prompts (version-controlled)
│   │   └── types.ts                   # AI evaluation types
│   ├── marketplace/
│   │   ├── amazon/
│   │   │   ├── client.ts              # Amazon API client
│   │   │   ├── search.ts              # Search functionality
│   │   │   └── types.ts               # Amazon API types
│   │   ├── ebay/
│   │   │   ├── client.ts              # eBay API client
│   │   │   ├── search.ts              # Search functionality
│   │   │   └── types.ts               # eBay API types
│   │   ├── rate-limiter.ts            # Rate limiting logic
│   │   └── types.ts                   # Common marketplace types
│   ├── recommendations/
│   │   ├── service.ts                  # Recommendation business logic
│   │   └── notifications.ts           # Notification delivery
│   ├── supabase/
│   │   ├── client.ts                  # Supabase client (web)
│   │   ├── server.ts                  # Supabase server client (API routes)
│   │   └── auth.ts                   # Auth helpers
│   └── db/
│       ├── schema.ts                  # Database schema (Prisma optional)
│       └── queries.ts                 # Database queries (Supabase)
├── types/
│   ├── recommendation.ts
│   ├── preference.ts
│   ├── listing.ts
│   ├── ai-evaluation.ts
│   └── marketplace.ts
└── hooks/
    ├── use-recommendations.ts
    ├── use-preferences.ts
    └── use-marketplace-search.ts

tests/
├── __tests__/
│   ├── components/
│   │   └── recommendations/
│   │       └── recommendation-card.test.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   └── evaluate-listing.test.ts
│   │   └── marketplace/
│   │       ├── amazon/
│   │       │   └── client.test.ts
│   │       └── ebay/
│   │           └── client.test.ts
│   └── app/
│       └── api/
│           └── recommendations/
│               └── route.test.ts
└── e2e/
    ├── recommendations.spec.ts
    └── preferences.spec.ts
```

**Structure Decision**: Next.js App Router web application structure. API routes handle marketplace integration and AI evaluation server-side (reusable for future React Native app). Client components handle UI and user interactions. Supabase provides database, authentication, and real-time features. Business logic in `src/lib/` is platform-agnostic and can be shared with React Native app.

## Constitution Check (Post-Design)

*Re-evaluated after Phase 1 design completion.*

### I. Test-First Development (NON-NEGOTIABLE)
✅ **PASS**: Test structure defined in project structure. All API routes, components, and business logic will have corresponding tests.

### II. TypeScript Strictness
✅ **PASS**: All data models, API contracts, and types are fully defined. Prisma will generate type-safe database access.

### III. Feature Branch Workflow (NON-NEGOTIABLE)
✅ **PASS**: Working on feature branch `001-ai-bargain-detection`.

### IV. Conventional Commits
✅ **PASS**: Will use appropriate scopes: `ai`, `marketplace`, `recommendations`, `api`, `components`.

### V. Component-Based Architecture
✅ **PASS**: Component structure defined with shadcn/ui base components and feature-specific components.

### VI. AI Evaluation Transparency
✅ **PASS**: AI evaluation data model includes confidence scores, reasoning, factors, and prompt versioning. Evaluation results are stored and auditable.

### VII. Marketplace Integration Standards
✅ **PASS**: Rate limiting strategy defined. Error handling and retry logic specified. API interactions will be logged.

### VIII. Data Privacy and Security
✅ **PASS**: API keys stored server-side only. Supabase provides encryption at rest and row-level security. All external calls use HTTPS. Supabase Auth handles secure authentication.

### IX. Performance Standards
✅ **PASS**: Performance targets defined. Caching strategy implemented. AI evaluation optimized with batching.

### X. Accessibility Compliance
✅ **PASS**: Will use semantic HTML, ARIA labels, and meet WCAG 2.1 Level AA standards in all components.

**GATE RESULT**: ✅ **ALL CHECKS PASS** - Ready for implementation.

## React Native Compatibility Strategy

**Future Goal**: Implement React Native mobile app that shares business logic and API with web app.

### Mobile-Compatible Stack Choices

**✅ Already Compatible**:
- **TypeScript**: Identical on web and mobile
- **React**: React Native uses React, patterns translate well
- **Supabase**: Official React Native SDK with full feature parity
- **OpenAI SDK**: HTTP-based, works in React Native
- **Business Logic** (`src/lib/`): Platform-agnostic, can be shared
- **Type Definitions** (`src/types/`): Shared between platforms
- **API Routes**: Next.js API routes serve as backend for mobile app

**⚠️ Web-Only (Need Mobile Alternatives)**:
- **Next.js**: Web-only, but API routes reusable as backend
- **Tailwind CSS**: Use NativeWind for React Native (same Tailwind classes)
- **shadcn/ui**: Use React Native Paper, NativeBase, or Tamagui for mobile
- **Playwright**: Use React Native Testing Library + Detox for mobile E2E

### Mobile Implementation Strategy

1. **Shared Business Logic**: All business logic in `src/lib/` works on both platforms
   - AI evaluation logic
   - Marketplace API clients (called from API routes)
   - Recommendation service
   - Type definitions

2. **API-First Design**: Next.js API routes designed to be mobile-friendly
   - RESTful JSON APIs
   - Authentication via Supabase Auth (works on both platforms)
   - Consistent error handling
   - Rate limiting

3. **UI Abstraction**: Separate presentation from business logic
   - Business logic in `src/lib/`
   - UI components platform-specific but share interfaces
   - State management: RTK Query, React Query, or Zustand (all work on both platforms)

4. **Database Access**: 
   - Web: Supabase client or API routes
   - Mobile: Supabase React Native SDK with RLS policies
   - Direct database access on mobile (secure via RLS)

5. **Authentication**:
   - Supabase Auth works identically on web and mobile
   - Same auth flow, same tokens, same user management

### Recommended Mobile Stack (When Implementing)

- **Framework**: React Native (Expo recommended for easier setup)
- **UI Library**: 
  - **Tamagui** (RECOMMENDED): Cross-platform - works on web AND React Native with same components
  - **React Native Paper**: Mobile-only, Material Design components
  - Note: Choose one - they don't work together, but Tamagui allows sharing UI components between web and mobile
- **Styling**: NativeWind (Tailwind for React Native) or StyleSheet
- **Navigation**: React Navigation (mobile standard)
- **State**: RTK Query, React Query, or Zustand (all work on both platforms)
- **Icons**: lucide-react-native (same API as web)
- **Animations**: react-native-reanimated (similar to framer-motion)
- **Testing**: React Native Testing Library + Detox

### Migration Path

**Option 1: Monorepo (Recommended)**
When building mobile app, keep both web and mobile in the same repository:
1. Use monorepo structure (Turborepo, Nx, or simple workspace)
2. Shared packages:
   - `packages/shared` - Business logic (`src/lib/`), types (`src/types/`)
   - `packages/web` - Next.js web app
   - `packages/mobile` - React Native app (Expo)
3. Both apps import from `packages/shared`
4. Use Supabase React Native SDK in mobile app
5. Call Next.js API routes for marketplace/AI operations
6. Build mobile UI with Tamagui (can share components with web) or React Native Paper
7. Use React Navigation for mobile navigation

**Option 2: Separate Repositories**
1. Create new React Native project (Expo or CLI)
2. Copy/share `src/lib/` business logic
3. Copy/share `src/types/` type definitions
4. Use Supabase React Native SDK for database/auth
5. Call Next.js API routes for marketplace/AI operations
6. Build mobile UI with Tamagui or React Native Paper
7. Use React Navigation for mobile navigation

**Recommendation**: Use Option 1 (Monorepo) for better code sharing and maintenance.

**No changes needed to existing stack** - current choices support this path.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution checks pass.
