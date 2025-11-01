import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function CurrentStatusScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push('/onboarding/goals');
    }
  };

  return (
    <OnboardingLayout
      title="How is your poop currently?"
      subtitle="This will help us understand your starting point."
      progress={50}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.choicesContainer}>
          <ChoiceButton
            label="Excellent"
            description="Regular, healthy bowel movements"
            selected={selected === 'excellent'}
            onPress={() => setSelected('excellent')}
          />
          <ChoiceButton
            label="Good"
            description="Mostly regular, occasional issues"
            selected={selected === 'good'}
            onPress={() => setSelected('good')}
          />
          <ChoiceButton
            label="Fair"
            description="Some irregularity or discomfort"
            selected={selected === 'fair'}
            onPress={() => setSelected('fair')}
          />
          <ChoiceButton
            label="Poor"
            description="Frequent issues and discomfort"
            selected={selected === 'poor'}
            onPress={() => setSelected('poor')}
          />
        </View>

        <ContinueButton onPress={handleContinue} disabled={!selected} />
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  choicesContainer: {
    gap: 12,
  },
});
