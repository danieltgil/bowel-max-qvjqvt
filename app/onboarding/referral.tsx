import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import * as Haptics from 'expo-haptics';

export default function ReferralScreen() {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');

  const handleContinue = () => {
    router.push('/onboarding/loading');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/loading');
  };

  return (
    <OnboardingLayout
      title="Have a referral code?"
      subtitle="Enter it below to unlock special benefits."
      progress={95}
      showBack={true}
    >
      <View style={styles.content}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter referral code"
            placeholderTextColor="#9CA3AF"
            value={referralCode}
            onChangeText={setReferralCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Referral benefits:</Text>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Extra 7 days free trial</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.benefitText}>Exclusive features access</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <ContinueButton
            label={referralCode ? 'Apply Code' : 'Continue'}
            onPress={handleContinue}
          />
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
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  benefitsContainer: {
    marginTop: 32,
    paddingHorizontal: 4,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
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
