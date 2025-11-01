import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function GenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedGender) {
      router.push('/onboarding/how-heard');
    }
  };

  return (
    <OnboardingLayout
      title="Choose your Gender"
      subtitle="This will be used to calibrate your custom plan."
      progress={10}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.choicesContainer}>
          <ChoiceButton
            label="Male"
            selected={selectedGender === 'male'}
            onPress={() => setSelectedGender('male')}
          />
          <ChoiceButton
            label="Female"
            selected={selectedGender === 'female'}
            onPress={() => setSelectedGender('female')}
          />
          <ChoiceButton
            label="Other"
            selected={selectedGender === 'other'}
            onPress={() => setSelectedGender('other')}
          />
        </View>

        <ContinueButton onPress={handleContinue} disabled={!selectedGender} />
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
