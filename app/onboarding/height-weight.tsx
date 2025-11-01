import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import { Picker } from '@react-native-picker/picker';

export default function HeightWeightScreen() {
  const router = useRouter();
  const [isMetric, setIsMetric] = useState(true);
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(54);

  const handleContinue = () => {
    router.push('/onboarding/birthday');
  };

  // Generate height options (cm or feet/inches)
  const heightOptions = Array.from({ length: 100 }, (_, i) => 150 + i);
  // Generate weight options (kg or lbs)
  const weightOptions = Array.from({ length: 150 }, (_, i) => 30 + i);

  return (
    <OnboardingLayout
      title="Height & weight"
      subtitle="This will be used to calibrate your custom plan."
      progress={30}
      showBack={true}
    >
      <View style={styles.content}>
        <View>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleText, !isMetric && styles.toggleTextActive]}>
              Imperial
            </Text>
            <Pressable
              style={styles.toggle}
              onPress={() => setIsMetric(!isMetric)}
            >
              <View style={[styles.toggleSwitch, isMetric && styles.toggleSwitchActive]} />
            </Pressable>
            <Text style={[styles.toggleText, isMetric && styles.toggleTextActive]}>
              Metric
            </Text>
          </View>

          {/* Pickers */}
          <View style={styles.pickersContainer}>
            {/* Height Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Height</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={height}
                  onValueChange={(value) => setHeight(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {heightOptions.map((h) => (
                    <Picker.Item
                      key={h}
                      label={`${h} cm`}
                      value={h}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Weight Picker */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Weight</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={weight}
                  onValueChange={(value) => setWeight(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {weightOptions.map((w) => (
                    <Picker.Item
                      key={w}
                      label={`${w} kg`}
                      value={w}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  toggleTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  toggle: {
    width: 60,
    height: 32,
    backgroundColor: '#000000',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 3,
    justifyContent: 'center',
  },
  toggleSwitch: {
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    position: 'absolute',
    left: 3,
  },
  toggleSwitchActive: {
    left: 31,
  },
  pickersContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
});
