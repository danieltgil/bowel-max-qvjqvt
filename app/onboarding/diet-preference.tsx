import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function DietPreferenceScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push('/onboarding/thank-you');
    }
  };

  return (
    <OnboardingLayout
      title="Do you follow a diet?"
      subtitle="This helps us provide relevant recommendations."
      progress={80}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.choicesContainer}>
          <ChoiceButton
            label="Vegan"
            description="No animal products"
            selected={selected === 'vegan'}
            onPress={() => setSelected('vegan')}
          />
          <ChoiceButton
            label="Vegetarian"
            description="No meat, but eggs and dairy"
            selected={selected === 'vegetarian'}
            onPress={() => setSelected('vegetarian')}
          />
          <ChoiceButton
            label="Pescatarian"
            description="Fish and seafood, no other meat"
            selected={selected === 'pescatarian'}
            onPress={() => setSelected('pescatarian')}
          />
          <ChoiceButton
            label="No restrictions"
            description="I eat everything"
            selected={selected === 'none'}
            onPress={() => setSelected('none')}
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
