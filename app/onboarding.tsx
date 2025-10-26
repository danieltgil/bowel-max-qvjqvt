
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import Slider from "@react-native-community/slider";
import { supabase } from "@/app/integrations/supabase/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // User registration data
  const [name, setName] = useState("");
  const [age, setAge] = useState(30);
  const [diet, setDiet] = useState(2); // 0: Low, 1: Medium, 2: Balanced, 3: High
  const [hydration, setHydration] = useState(6); // glasses per day
  
  // Gut health specific data
  const [hasConditions, setHasConditions] = useState<boolean | null>(null);
  const [conditionsDescription, setConditionsDescription] = useState("");
  const [restroomFrequency, setRestroomFrequency] = useState(1); // 0: <1/day, 1: 1-2/day, 2: 3+/day

  const dietLabels = ['Low Fiber', 'Medium Fiber', 'Balanced', 'High Fiber'];
  const frequencyLabels = ['Less than once', '1-2 times', '3+ times'];

  const handleNext = async () => {
    if (step === 1 && name.trim() === "") {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    if (step === 5 && hasConditions === null) {
      Alert.alert("Selection Required", "Please let us know if you have any gut health conditions.");
      return;
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      // Complete onboarding and save to database
      await handleCompleteOnboarding();
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: name.trim(),
          age: age,
          diet_type: dietLabels[diet],
          hydration_glasses: hydration,
          has_conditions: hasConditions || false,
          conditions_description: hasConditions ? conditionsDescription.trim() : null,
          restroom_frequency: frequencyLabels[restroomFrequency],
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        Alert.alert("Error", "Failed to save your profile. Please try again.");
        setLoading(false);
        return;
      }

      console.log('User created successfully:', data);
      
      // Store user ID locally for future use
      await AsyncStorage.setItem('userId', data.id);
      
      Alert.alert(
        "Welcome to Bowel Max! 🎉",
        "Your profile has been created successfully. Let's start tracking your gut health!",
        [
          {
            text: "Get Started",
            onPress: () => router.replace('/(tabs)/(home)/'),
          },
        ]
      );
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Onboarding?",
      "We recommend completing the setup to get personalized insights.",
      [
        { text: "Continue Setup", style: "cancel" },
        { text: "Skip", onPress: () => router.replace('/(tabs)/(home)/') },
      ]
    );
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
              <Text style={styles.emoji}>👤</Text>
            </View>
            <Text style={styles.stepTitle}>What&apos;s your name?</Text>
            <Text style={styles.stepDescription}>
              We&apos;d love to know what to call you!
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>
        );

      case 2:
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

      case 3:
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

      case 4:
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
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>🏥</Text>
            </View>
            <Text style={styles.stepTitle}>Any gut health conditions?</Text>
            <Text style={styles.stepDescription}>
              Do you have IBS, Crohn&apos;s, or other digestive conditions?
            </Text>
            <View style={styles.buttonGroup}>
              <Pressable
                style={[
                  styles.choiceButton,
                  hasConditions === false && styles.choiceButtonActive,
                ]}
                onPress={() => {
                  setHasConditions(false);
                  setConditionsDescription("");
                }}
              >
                <Text
                  style={[
                    styles.choiceButtonText,
                    hasConditions === false && styles.choiceButtonTextActive,
                  ]}
                >
                  No
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.choiceButton,
                  hasConditions === true && styles.choiceButtonActive,
                ]}
                onPress={() => setHasConditions(true)}
              >
                <Text
                  style={[
                    styles.choiceButtonText,
                    hasConditions === true && styles.choiceButtonTextActive,
                  ]}
                >
                  Yes
                </Text>
              </Pressable>
            </View>
            {hasConditions === true && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Please describe (optional)"
                  placeholderTextColor={colors.textSecondary}
                  value={conditionsDescription}
                  onChangeText={setConditionsDescription}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>🚽</Text>
            </View>
            <Text style={styles.stepTitle}>Restroom frequency?</Text>
            <Text style={styles.stepDescription}>
              How often do you typically use the restroom per day?
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValue}>{frequencyLabels[restroomFrequency]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={2}
                step={1}
                value={restroomFrequency}
                onValueChange={setRestroomFrequency}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primaryDark}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>Less</Text>
                <Text style={styles.sliderLabel}>More</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map((index) => (
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
        <Pressable 
          style={[styles.nextButton, loading && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {step === 6 ? 'Complete Setup' : 'Next'}
              </Text>
              <IconSymbol name="arrow.right" color={colors.text} size={20} />
            </>
          )}
        </Pressable>
        
        {step < 6 && !loading && (
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    minHeight: '100%',
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
    paddingBottom: 40,
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
  inputContainer: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
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
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  choiceButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  choiceButtonTextActive: {
    color: colors.text,
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
  nextButtonDisabled: {
    opacity: 0.6,
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
