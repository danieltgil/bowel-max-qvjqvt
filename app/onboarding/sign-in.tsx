import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import * as Haptics from 'expo-haptics';

export default function SignInScreen() {
  const router = useRouter();

  const handleAppleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Apple Sign In
    router.push('/onboarding/plan-selection');
  };

  const handleGoogleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement Google Sign In
    router.push('/onboarding/plan-selection');
  };

  return (
    <OnboardingLayout
      title="Save your progress"
      progress={98}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          {/* Empty space for centered layout */}
        </View>

        <View style={styles.buttonsContainer}>
          {/* Apple Sign In Button */}
          <Pressable
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          >
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.appleButtonText}>Sign in with Apple</Text>
          </Pressable>

          {/* Google Sign In Button */}
          <Pressable
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  },
  buttonsContainer: {
    gap: 16,
    paddingBottom: 20,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  googleIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4285F4',
    fontFamily: 'Arial',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
