
import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import Slider from "@react-native-community/slider";
import { supabase } from "@/app/integrations/supabase/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/contexts/UserContext";

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUserId } = useUser();
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const styles = createStyles(colors);

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

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    if (step === 1 && name.trim() === "") {
      Alert.alert("Name Required", "Please enter your name to continue.");
      return;
    }

    if (step === 5 && hasConditions === null) {
      Alert.alert("Selection Required", "Please let us know if you have any gut health conditions.");
      return;
    }

    if (step < 7) {
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

      // Store user ID locally and update context
      await setUserId(data.id);

      Alert.alert(
        "Welcome to Bowel Max!",
        "Your profile has been created successfully.",
        [
          {
            text: "Get Started",
            onPress: () => router.replace('/(tabs)/(home)/' as any),
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

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Welcome to Bowel Max</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
            </Text>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What's your name?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
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
            <Text style={styles.stepTitle}>How old are you?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
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
                minimumTrackTintColor="#000000"
                maximumTrackTintColor={colors.border}
                thumbTintColor="#000000"
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
            <Text style={styles.stepTitle}>What's your diet like?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
            </Text>
            <View style={styles.buttonGroup}>
              {dietLabels.map((label, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.choiceButton,
                    diet === index && styles.choiceButtonActive,
                  ]}
                  onPress={() => setDiet(index)}
                >
                  <Text
                    style={[
                      styles.choiceButtonText,
                      diet === index && styles.choiceButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Daily water intake?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
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
                minimumTrackTintColor="#000000"
                maximumTrackTintColor={colors.border}
                thumbTintColor="#000000"
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
            <Text style={styles.stepTitle}>Any gut health conditions?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
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
            <Text style={styles.stepTitle}>Restroom frequency?</Text>
            <Text style={styles.stepDescription}>
              This will be used to calibrate your custom plan.
            </Text>
            <View style={styles.buttonGroup}>
              {frequencyLabels.map((label, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.choiceButton,
                    restroomFrequency === index && styles.choiceButtonActive,
                  ]}
                  onPress={() => setRestroomFrequency(index)}
                >
                  <Text
                    style={[
                      styles.choiceButtonText,
                      restroomFrequency === index && styles.choiceButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What to aim for</Text>
            <Text style={styles.stepDescription}>
              Types 3 and 4 indicate optimal gut health.
            </Text>

            <View style={styles.educationCard}>
              <View style={styles.educationRow}>
                <Text style={styles.bristolType}>Type 3</Text>
                <Text style={styles.bristolDescription}>Sausage with cracks</Text>
              </View>
              <View style={styles.educationRow}>
                <Text style={styles.bristolType}>Type 4</Text>
                <Text style={styles.bristolDescription}>Smooth, soft sausage</Text>
              </View>
            </View>

            <View style={styles.educationFooter}>
              <Text style={styles.educationFooterText}>
                Bowel Max helps you track and achieve optimal gut health through personalized insights.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const totalSteps = 8;
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header with back button and progress */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          {step > 0 && (
            <IconSymbol name="arrow.left" color={colors.text} size={24} />
          )}
        </Pressable>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Step Content */}
      {renderStep()}

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>
              {step === 7 ? 'Complete' : 'Continue'}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  textInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 18,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 20,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 32,
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
    gap: 12,
    marginTop: 20,
  },
  choiceButton: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  choiceButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  choiceButtonTextActive: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  continueButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  educationCard: {
    backgroundColor: colors.card || '#FAFAFA',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.border || '#E5E5E5',
  },
  educationRow: {
    marginBottom: 20,
  },
  bristolType: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  bristolDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  educationFooter: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border || '#E5E5E5',
  },
  educationFooterText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },
});
