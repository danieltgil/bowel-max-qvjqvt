import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => {
      router.push('/onboarding/plan-selection');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Icon */}
        <View style={styles.iconContainer}>
          <Svg width={100} height={120} viewBox="0 0 100 120">
            <Path
              d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
              fill="#000000"
            />
          </Svg>
        </View>

        <Text style={styles.title}>Creating your personalized plan</Text>

        <ActivityIndicator size="large" color="#000000" style={styles.spinner} />

        <Text style={styles.subtitle}>
          Analyzing your responses and customizing your gut health journey...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  spinner: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
