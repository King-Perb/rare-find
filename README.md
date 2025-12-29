# Rare Find

AI-powered bargain detection system that searches Amazon and eBay for undervalued antique and collectible items, evaluates listings using AI to determine if they're undervalued, and sends buy recommendations to users.

## Monorepo Structure

This project uses a monorepo structure with npm workspaces:

```
rare-find/
├── packages/
│   ├── shared/          # Shared business logic and types
│   │   └── src/
│   │       ├── lib/      # Business logic (AI, marketplace, recommendations)
│   │       └── types/    # TypeScript types
│   ├── web/             # Next.js web application
│   │   └── src/
│   │       ├── app/      # Next.js App Router
│   │       └── components/ # React components
│   └── mobile/          # React Native mobile application (to be implemented)
│       └── src/
│           ├── app/      # Expo Router pages
│           └── components/ # React Native components
└── package.json          # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm 9+ installed

### Installation

```bash
# Install all dependencies for all packages
npm install
```

### Development

```bash
# Start the web app in development mode
npm run dev

# Or run from the web package directly
cd packages/web
npm run dev
```

### Available Scripts

**Root level (runs in all packages):**
- `npm run dev` - Start web app development server
- `npm run build` - Build web app for production
- `npm run type:check` - Type check all packages
- `npm run test` - Run tests in web package
- `npm run test:e2e` - Run E2E tests
- `npm run mobile:start` - Start mobile app (Expo)
- `npm run mobile:ios` - Run mobile app on iOS
- `npm run mobile:android` - Run mobile app on Android

**Web package (`packages/web`):**
- `npm run dev` - Start Next.js dev server
- `npm run build` - Build Next.js app
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Playwright E2E tests

**Shared package (`packages/shared`):**
- `npm run type:check` - Type check shared code

**Mobile package (`packages/mobile`):**
- `npm run start` - Start Expo dev server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run type:check` - Type check

## Package Details

### `@rare-find/shared`

Shared business logic and TypeScript types used by both web and (future) mobile apps.

**Exports:**
- `@rare-find/shared/lib/*` - Business logic modules
- `@rare-find/shared/types/*` - TypeScript type definitions

**Usage:**
```typescript
import { someFunction } from '@rare-find/shared/lib/ai';
import type { Recommendation } from '@rare-find/shared/types';
```

### `@rare-find/web`

Next.js 15 web application with App Router.

**Tech Stack:**
- Next.js 16.0.10
- React 19.2.0
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui components
- Vitest for unit testing
- Playwright for E2E testing

## Adding a New Package

To add a new package (e.g., mobile app):

1. Create directory: `packages/mobile/`
2. Add `package.json` with name `@rare-find/mobile`
3. Add to root `package.json` workspaces (already includes `packages/*`)
4. Run `npm install` to link packages

## Mobile App

The mobile app structure is set up in `packages/mobile/` but not yet implemented.

**Status**: Structure ready, implementation pending

**When ready to implement**:

1. Install dependencies: `npm install` (from root)
2. Set up Expo development environment
3. Install UI library (React Native Paper or Tamagui)
4. Install state management (RTK Query, React Query, or Zustand)
5. Set up Supabase React Native SDK
6. Implement screens and navigation
7. Integrate with Next.js API routes
8. Use shared business logic from `@rare-find/shared`

See `packages/mobile/README.md` for details.

## Development Workflow

1. Make changes in appropriate package
2. Shared code changes affect all packages automatically (via workspace links)
3. Test changes: `npm run test` and `npm run test:e2e`
4. Type check: `npm run type:check`
5. Build: `npm run build`

## Project Structure

See [specs/001-ai-bargain-detection/plan.md](./specs/001-ai-bargain-detection/plan.md) for detailed architecture and implementation plan.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
