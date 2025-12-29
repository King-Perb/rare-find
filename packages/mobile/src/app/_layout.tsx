// Expo Router root layout
// This file will be created when implementing the mobile app

import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Rare Find' }} />
      </Stack>
    </PaperProvider>
  );
}
