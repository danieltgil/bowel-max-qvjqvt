import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import Svg, { Path } from 'react-native-svg';

export default function ThankYouScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/apple-health');
  };

  return (
    <OnboardingLayout
      title="Thank you for trusting us"
      subtitle="We're excited to help you on your gut health journey."
      progress={85}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          {/* Large Icon */}
          <View style={styles.iconContainer}>
            <Svg width={120} height={140} viewBox="0 0 100 120">
              <Path
                d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
                fill="#000000"
              />
            </Svg>
          </View>

          <Text style={styles.message}>
            Let's set up some helpful features to make tracking easier.
          </Text>
        </View>

        <ContinueButton onPress={handleContinue} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 20,
  },
});
