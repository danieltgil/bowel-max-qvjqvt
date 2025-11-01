import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ChoiceButton } from '@/components/onboarding/ChoiceButton';
import { ContinueButton } from '@/components/onboarding/ContinueButton';

export default function HowHeardScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (selected) {
      router.push('/onboarding/height-weight');
    }
  };

  return (
    <OnboardingLayout
      title="Where did you hear about us?"
      progress={20}
      showBack={true}
    >
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.choicesContainer}>
            <ChoiceButton
              label="TV"
              icon={<Text style={styles.icon}>📺</Text>}
              selected={selected === 'tv'}
              onPress={() => setSelected('tv')}
            />
            <ChoiceButton
              label="TikTok"
              icon={<Text style={styles.icon}>⚫</Text>}
              selected={selected === 'tiktok'}
              onPress={() => setSelected('tiktok')}
            />
            <ChoiceButton
              label="Friend or family"
              icon={<Text style={styles.icon}>👥</Text>}
              selected={selected === 'friend'}
              onPress={() => setSelected('friend')}
            />
            <ChoiceButton
              label="App Store"
              icon={<Text style={styles.icon}>📱</Text>}
              selected={selected === 'appstore'}
              onPress={() => setSelected('appstore')}
            />
            <ChoiceButton
              label="Instagram"
              icon={<Text style={styles.icon}>📷</Text>}
              selected={selected === 'instagram'}
              onPress={() => setSelected('instagram')}
            />
            <ChoiceButton
              label="Youtube"
              icon={<Text style={styles.icon}>▶️</Text>}
              selected={selected === 'youtube'}
              onPress={() => setSelected('youtube')}
            />
            <ChoiceButton
              label="Other"
              icon={<Text style={styles.icon}>💬</Text>}
              selected={selected === 'other'}
              onPress={() => setSelected('other')}
            />
          </View>
        </ScrollView>

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
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  choicesContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  icon: {
    fontSize: 24,
  },
});
