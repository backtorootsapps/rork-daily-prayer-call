import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="app-intro" />
      <Stack.Screen name="name" />
      <Stack.Screen name="age" />
      <Stack.Screen name="motivation" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="faith-vision" />
      <Stack.Screen name="prayer-frequency" />
      <Stack.Screen name="god-relationship" />
      <Stack.Screen name="faith-obstacles" />
      <Stack.Screen name="deeper-struggles" />
      <Stack.Screen name="honesty-thanks" />
      <Stack.Screen name="encouragement" />
      <Stack.Screen name="denomination" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="journey-summary" />
      <Stack.Screen name="prayer-power" />
      <Stack.Screen name="screen-time" />
      <Stack.Screen name="topics" />
      <Stack.Screen name="time" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="greeting" />
    </Stack>
  );
}
