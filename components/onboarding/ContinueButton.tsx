import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ContinueButtonProps {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}

export function ContinueButton({ label = 'Continue', onPress, disabled = false }: ContinueButtonProps) {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
