import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function ConditionsScreen() {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const handleContinue = () => {
    router.push('/onboarding/diet-preference');
  };

  return (
    <OnboardingLayout
      title="Do you have any conditions?"
      subtitle="Select all that apply, or skip if none."
      progress={70}
      showBack={true}
    >
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.choicesContainer}>
          <ChoiceButton
            label="IBS (Irritable Bowel Syndrome)"
            selected={selectedConditions.includes('ibs')}
            onPress={() => toggleCondition('ibs')}
          />
          <ChoiceButton
            label="IBD (Crohn's, Ulcerative Colitis)"
            selected={selectedConditions.includes('ibd')}
            onPress={() => toggleCondition('ibd')}
          />
          <ChoiceButton
            label="Chronic constipation"
            selected={selectedConditions.includes('constipation')}
            onPress={() => toggleCondition('constipation')}
          />
          <ChoiceButton
            label="Chronic diarrhea"
            selected={selectedConditions.includes('diarrhea')}
            onPress={() => toggleCondition('diarrhea')}
          />
          <ChoiceButton
            label="Food intolerances"
            selected={selectedConditions.includes('intolerances')}
            onPress={() => toggleCondition('intolerances')}
          />
          <ChoiceButton
            label="None of the above"
            selected={selectedConditions.includes('none')}
            onPress={() => {
              if (selectedConditions.includes('none')) {
                setSelectedConditions([]);
              } else {
                setSelectedConditions(['none']);
              }
            }}
          />
          </View>
        </ScrollView>

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
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  choicesContainer: {
    gap: 12,
    paddingBottom: 20,
  },
});
