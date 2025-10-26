
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Slider from "@react-native-community/slider";

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(30);
  const [diet, setDiet] = useState(2); // 0: Low, 1: Medium, 2: Balanced, 3: High
  const [hydration, setHydration] = useState(6); // glasses per day

  const dietLabels = ['Low Fiber', 'Medium Fiber', 'Balanced', 'High Fiber'];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      router.replace('/(tabs)/(home)/');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/(home)/');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>👋</Text>
            </View>
            <Text style={styles.stepTitle}>Welcome to Bowel Max!</Text>
            <Text style={styles.stepDescription}>
              Let&apos;s learn about your gut health together. 
              We&apos;ll ask a few quick questions to personalize your experience.
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>🎂</Text>
            </View>
            <Text style={styles.stepTitle}>How old are you?</Text>
            <Text style={styles.stepDescription}>
              This helps us provide age-appropriate health insights.
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{age} years</Text>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={100}
                step={1}
                value={age}
                onValueChange={setAge}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primaryDark}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>18</Text>
                <Text style={styles.sliderLabel}>100</Text>
              </View>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>🥗</Text>
            </View>
            <Text style={styles.stepTitle}>What&apos;s your diet like?</Text>
            <Text style={styles.stepDescription}>
              Understanding your fiber intake helps us analyze your results better.
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{dietLabels[diet]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={3}
                step={1}
                value={diet}
                onValueChange={setDiet}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primaryDark}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Low</Text>
                <Text style={styles.sliderLabel}>High</Text>
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>💧</Text>
            </View>
            <Text style={styles.stepTitle}>Daily water intake?</Text>
            <Text style={styles.stepDescription}>
              Hydration is key to healthy digestion. How many glasses do you drink daily?
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{hydration} glasses</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={12}
                step={1}
                value={hydration}
                onValueChange={setHydration}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primaryDark}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>1</Text>
                <Text style={styles.sliderLabel}>12</Text>
              </View>
            </View>
            <View style={styles.privacyNote}>
              <IconSymbol name="lock.fill" color={colors.success} size={20} />
              <Text style={styles.privacyText}>
                All photos are analyzed securely and never shared
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Get Started' : 'Next'}
          </Text>
          <IconSymbol name="arrow.right" color={colors.text} size={20} />
        </Pressable>
        
        {step < 3 && (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  emoji: {
    fontSize: 80,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
