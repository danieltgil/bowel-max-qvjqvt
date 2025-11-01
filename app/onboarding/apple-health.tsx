import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import * as Haptics from 'expo-haptics';

export default function AppleHealthScreen() {
  const router = useRouter();

  const handleConnect = () => {
    // TODO: Implement Apple Health connection
    router.push('/onboarding/notifications');
  };

  const handleNotNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/notifications');
  };

  return (
    <OnboardingLayout
      title="Connect to Apple Health"
      subtitle="Sync your health data for better insights."
      progress={88}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          {/* Apple Health Icon Placeholder */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>❤️</Text>
          </View>

          <Text style={styles.description}>
            Connect to Apple Health to automatically track hydration, activity, and sleep patterns that affect your gut health.
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Automatic data syncing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Better personalized insights</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Track correlations with health</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <ContinueButton label="Connect" onPress={handleConnect} />
          <Pressable onPress={handleNotNow} style={styles.notNowButton}>
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>
        </View>
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
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconText: {
    fontSize: 60,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  benefitsList: {
    width: '100%',
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  checkmark: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  buttonsContainer: {
    gap: 12,
  },
  notNowButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  notNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
