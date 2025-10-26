
import { Redirect } from 'expo-router';

export default function Index() {
  // In a real app, you would check if the user has completed onboarding
  // For now, we'll always show onboarding first
  // You can change this to redirect to /(tabs)/(home)/ to skip onboarding
  return <Redirect href="/onboarding" />;
}
