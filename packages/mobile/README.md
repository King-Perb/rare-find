# @rare-find/mobile

React Native mobile application for Rare Find (to be implemented).

## Tech Stack (Planned)

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Library**: React Native Paper (Material Design)
- **State Management**: RTK Query, React Query, or Zustand (TBD)
- **Database**: Supabase React Native SDK
- **TypeScript**: 5 (strict mode)

## Getting Started

This package is set up but not yet implemented. When ready to build:

```bash
# Install dependencies (from root)
npm install

# Start Expo development server
cd packages/mobile
npm start

# Or from root
npm run start --workspace=@rare-find/mobile
```

## Project Structure

```
src/
├── app/              # Expo Router pages
├── components/       # React Native components
│   └── ui/          # UI components (React Native Paper)
├── lib/             # Mobile-specific utilities
├── hooks/           # React hooks
└── types/           # Mobile-specific types
```

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
EXPO_PUBLIC_SUPABASE_URL="..."
EXPO_PUBLIC_SUPABASE_ANON_KEY="..."

# API
EXPO_PUBLIC_API_URL="http://localhost:3000/api"
```

## Development

### Prerequisites

- Node.js 18+
- Expo CLI (use `npx expo` - no global install needed)
- iOS Simulator (for Mac) or Android Emulator

### Commands

- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in web browser
- `npm run type:check` - Type check
- `npm test` - Run tests

## Implementation Plan

When implementing the mobile app:

1. Set up Expo Router navigation
2. UI library already installed: React Native Paper
3. Install state management (RTK Query, React Query, or Zustand)
4. Set up Supabase React Native SDK
5. Create screens for:
   - Recommendations list
   - Recommendation details
   - Preferences configuration
   - Authentication
6. Integrate with Next.js API routes for marketplace/AI operations
7. Use shared business logic from `@rare-find/shared`

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

