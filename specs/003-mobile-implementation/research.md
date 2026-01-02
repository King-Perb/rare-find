# Research: Mobile Implementation (React Native/Expo)

## Existing State

The `packages/mobile` directory currently contains a skeletal Expo project with the following characteristics:
- **Framework**: Expo (SDK 54/55)
- **Navigation**: Expo Router (SDK matched)
- **React Native**: 0.81/0.83
- **UI Library**: React Native Paper is listed in README as planned.
- **Shared Logic**: README indicates intention to use `@rare-find/shared`.

## Platform Requirements

### Navigation
- Must mirror the web app's route structure (home, evaluate, results).
- Native tab navigation or drawer navigation is recommended for mobile ergonomics.

### UI/UX
- Responsive design tailored for various screen sizes (iOS/Android).
- Dark mode support (to match web visual enhancements).
- Touch-friendly interactions.

### Integration
- **Supabase**: Requires `supabase-js` for React Native configuration.
- **Shared Package**: Business logic (AI evaluation, data validation) should be strictly maintained in `packages/shared`.

## Challenges
- **Asset Loading**: Lottie animations from the web implementation must be compatible with `lottie-react-native`.
- **Environment Variables**: Expo uses `EXPO_PUBLIC_` prefixes which differs from Next.js `NEXT_PUBLIC_`.
- **Offline Mode**: Mobile apps often require better offline handling than web apps.
