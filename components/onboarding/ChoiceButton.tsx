import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ChoiceButtonProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}

export function ChoiceButton({ label, description, icon, selected, onPress }: ChoiceButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      style={[styles.button, selected && styles.buttonSelected]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
          {description && (
            <Text style={[styles.description, selected && styles.descriptionSelected]}>
              {description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  labelSelected: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 4,
  },
  descriptionSelected: {
    color: '#D1D5DB',
  },
});
