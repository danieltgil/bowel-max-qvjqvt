import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

export default function LandingScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/gender');
  };

  const handleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to sign in
  };

  return (
    <View style={styles.container}>
      {/* Hero Section with App Preview */}
      <View style={styles.heroSection}>
        {/* Poop Icon Logo */}
        <View style={styles.logoContainer}>
          <Svg width={60} height={70} viewBox="0 0 100 120">
            <Path
              d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
              fill="#000000"
            />
          </Svg>
        </View>

        {/* Placeholder for app preview - can be replaced with actual image */}
        <View style={styles.phonePreview}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneScreen}>
              <Text style={styles.previewText}>📊</Text>
              <Text style={styles.previewSubtext}>Track your gut health</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Gut health tracking made easy</Text>

        {/* Get Started Button */}
        <Pressable
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </Pressable>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <Pressable onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    left: 24,
  },
  phonePreview: {
    width: 280,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneFrame: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 80,
    marginBottom: 16,
  },
  previewSubtext: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  getStartedButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});
