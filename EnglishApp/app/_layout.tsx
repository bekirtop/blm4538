import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MistakesProvider } from '@/context/MistakesContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_SEEN_KEY } from './onboarding';

export const unstable_settings = {
  anchor: '(tabs)',
};

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_SEEN_KEY).then((val) => {
      const onOnboarding = (segments[0] as string) === 'onboarding';
      if (!val && !onOnboarding) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.replace('/onboarding' as any);
      }
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ProgressProvider>
        <MistakesProvider>
          <OnboardingGate>
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </OnboardingGate>
          <StatusBar style="auto" />
        </MistakesProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
