# @rare-find/shared

Shared business logic and TypeScript types for the Rare Find application.

This package contains code that is shared between the web application (`@rare-find/web`) and future mobile application (`@rare-find/mobile`).

## Structure

```
src/
├── lib/          # Business logic
│   ├── ai/       # AI evaluation logic
│   ├── marketplace/ # Marketplace API clients
│   └── recommendations/ # Recommendation service
├── types/        # TypeScript type definitions
└── index.ts      # Package entry point
```

## Usage

### In Web Package

```typescript
import { evaluateListing } from '@rare-find/shared/lib/ai';
import type { Recommendation } from '@rare-find/shared/types';
```

### In Mobile Package (Future)

```typescript
import { evaluateListing } from '@rare-find/shared/lib/ai';
import type { Recommendation } from '@rare-find/shared/types';
```

## Development

```bash
# Type check
npm run type:check
```

## Adding New Code

When adding shared code:

1. Place business logic in `src/lib/`
2. Place types in `src/types/`
3. Export from `src/index.ts`
4. Ensure code is platform-agnostic (no DOM APIs, no Node.js-specific code)
5. Test that it works in both web and mobile contexts

