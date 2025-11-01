import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function GoalsScreen() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      router.push('/onboarding/conditions');
    }
  };

  return (
    <OnboardingLayout
      title="What are your goals?"
      subtitle="Select all that apply."
      progress={60}
      showBack={true}
    >
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.choicesContainer}>
          <ChoiceButton
            label="Improve regularity"
            selected={selectedGoals.includes('regularity')}
            onPress={() => toggleGoal('regularity')}
          />
          <ChoiceButton
            label="Reduce bloating"
            selected={selectedGoals.includes('bloating')}
            onPress={() => toggleGoal('bloating')}
          />
          <ChoiceButton
            label="Better digestion"
            selected={selectedGoals.includes('digestion')}
            onPress={() => toggleGoal('digestion')}
          />
          <ChoiceButton
            label="Track gut health"
            selected={selectedGoals.includes('tracking')}
            onPress={() => toggleGoal('tracking')}
          />
          <ChoiceButton
            label="Identify food triggers"
            selected={selectedGoals.includes('triggers')}
            onPress={() => toggleGoal('triggers')}
          />
          <ChoiceButton
            label="Manage IBS symptoms"
            selected={selectedGoals.includes('ibs')}
            onPress={() => toggleGoal('ibs')}
          />
          </View>
        </ScrollView>

        <ContinueButton onPress={handleContinue} disabled={selectedGoals.length === 0} />
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
