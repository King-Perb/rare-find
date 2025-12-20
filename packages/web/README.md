# @rare-find/web

Next.js 15 web application for Rare Find.

## Tech Stack

- **Framework**: Next.js 16.0.10 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5 (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Testing**: Vitest (unit), Playwright (E2E)
- **State Management**: TBD (RTK Query, React Query, or Zustand)

## Getting Started

```bash
# Install dependencies (from root)
npm install

# Start development server
npm run dev

# Or from this directory
cd packages/web
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API routes
│   └── (dashboard)/  # Dashboard pages
├── components/       # React components
│   ├── ui/           # shadcn/ui components
│   └── ...           # Feature components
├── lib/              # Web-specific utilities
├── hooks/            # React hooks
└── types/            # Web-specific types
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type:check` - Type check
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## Using Shared Package

Import from `@rare-find/shared`:

```typescript
import { evaluateListing } from '@rare-find/shared/lib/ai';
import type { Recommendation } from '@rare-find/shared/types';
```

## Environment Variables

Create `.env.local` in this directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Marketplace APIs
AMAZON_ACCESS_KEY="..."
AMAZON_SECRET_KEY="..."
EBAY_APP_ID="..."

# AI
OPENAI_API_KEY="..."
```

