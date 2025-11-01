import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="landing" />
      <Stack.Screen name="gender" />
      <Stack.Screen name="how-heard" />
      <Stack.Screen name="height-weight" />
      <Stack.Screen name="birthday" />
      <Stack.Screen name="current-status" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="conditions" />
      <Stack.Screen name="diet-preference" />
      <Stack.Screen name="thank-you" />
      <Stack.Screen name="apple-health" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="referral" />
      <Stack.Screen name="loading" />
      <Stack.Screen name="plan-selection" />
    </Stack>
  );
}
