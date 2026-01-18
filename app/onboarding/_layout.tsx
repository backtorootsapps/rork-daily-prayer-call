import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="name" />
      <Stack.Screen name="time" />
      <Stack.Screen name="topics" />
      <Stack.Screen name="confirmation" />
    </Stack>
  );
}
