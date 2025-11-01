import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import { Picker } from '@react-native-picker/picker';

export default function BirthdayScreen() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState('December');
  const [day, setDay] = useState(2);
  const [year, setYear] = useState(2005);

  const handleContinue = () => {
    router.push('/onboarding/current-status');
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

  return (
    <OnboardingLayout
      title="When were you born?"
      subtitle="This will be used to calibrate your custom plan."
      progress={40}
      showBack={true}
    >
      <View style={styles.content}>
        <View style={styles.pickersContainer}>
          {/* Month Picker */}
          <View style={styles.pickerColumn}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={month}
                onValueChange={(value) => setMonth(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {months.map((m) => (
                  <Picker.Item key={m} label={m} value={m} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Day Picker */}
          <View style={styles.pickerColumnSmall}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={day}
                onValueChange={(value) => setDay(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {days.map((d) => (
                  <Picker.Item key={d} label={d.toString()} value={d} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Year Picker */}
          <View style={styles.pickerColumnSmall}>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={year}
                onValueChange={(value) => setYear(value)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {years.map((y) => (
                  <Picker.Item key={y} label={y.toString()} value={y} />
                ))}
              </Picker>
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
  pickersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  pickerColumn: {
    flex: 2,
  },
  pickerColumnSmall: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
});
