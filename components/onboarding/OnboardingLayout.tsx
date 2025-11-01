import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  progress: number;
  showBack?: boolean;
  onBack?: () => void;
}

export function OnboardingLayout({
  children,
  title,
  subtitle,
  progress,
  showBack = true,
  onBack,
}: OnboardingLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button and progress */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          {showBack && <IconSymbol name="arrow.left" color="#000000" size={24} />}
        </Pressable>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Title and Subtitle */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
});
