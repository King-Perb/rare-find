import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { supabase } from '../lib/supabase';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#007bff',
    secondary: '#6c757d',
  },
};

export default function RootLayout() {
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // Handle global session state here
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="recommendation/[id]" options={{ presentation: 'modal', title: 'Details' }} />
      </Stack>
    </PaperProvider>
  );
}
