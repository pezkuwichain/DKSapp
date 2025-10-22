import { Stack } from 'expo-router';
import '../i18n';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="citizenship/kyc" />
      <Stack.Screen name="modals/gating" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
