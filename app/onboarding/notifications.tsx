import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import * as Haptics from 'expo-haptics';

export default function NotificationsScreen() {
  const router = useRouter();

  const handleEnable = () => {
    // TODO: Request notification permissions
    router.push('/onboarding/referral');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/referral');
  };

  return (
    <OnboardingLayout
      title="Stay on track"
      subtitle="Get reminders to log your daily activity."
      progress={92}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          {/* Notification Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🔔</Text>
          </View>

          <Text style={styles.description}>
            Enable notifications to receive daily reminders and helpful tips for maintaining consistent tracking.
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Daily tracking reminders</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Personalized health tips</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Weekly progress updates</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <ContinueButton label="Enable Notifications" onPress={handleEnable} />
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
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
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});
