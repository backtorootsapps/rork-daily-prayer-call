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
      <Stack.Screen name="screen-time" />
      <Stack.Screen name="topics" />
      <Stack.Screen name="time" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="greeting" />
    </Stack>
  );
}
