
import { StyleSheet } from 'react-native';

// Light theme colors
export const lightColors = {
  background: '#FFFFFF',
  backgroundAlt: '#FAFAFA',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  primary: '#A7F3D0',
  primaryDark: '#74D680',
  secondary: '#D2B48C',
  accent: '#74D680',
  card: '#FAFAFA',
  highlight: '#FDE68A',
  border: '#E5E5E5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Dark theme colors
export const darkColors = {
  background: '#000000',
  backgroundAlt: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textLight: '#737373',
  primary: '#A7F3D0',
  primaryDark: '#74D680',
  secondary: '#D2B48C',
  accent: '#74D680',
  card: '#1A1A1A',
  highlight: '#3F3F00',
  border: '#2A2A2A',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Default colors (light mode) for backward compatibility
export const colors = lightColors;

export function getColors(isDark: boolean) {
  return isDark ? darkColors : lightColors;
}

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
  },
});
