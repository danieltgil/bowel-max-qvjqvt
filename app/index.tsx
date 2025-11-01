
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors } from '@/styles/commonStyles';
import Svg, { Path } from 'react-native-svg';

export default function Index() {
  const { user, loading } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    // Give the UserContext time to load
    const checkTimer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(checkTimer);
    };
  }, []);

  // Show splash screen first
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoContainer}>
          {/* Black poop silhouette SVG - swirled conical shape */}
          <Svg width={50} height={60} viewBox="0 0 100 120" style={styles.poopIcon}>
            {/* Swirled conical poop shape - wider base, tapered top */}
            <Path
              d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
              fill="#000000"
            />
          </Svg>
          {/* Bowel Max logo text */}
          <Text style={styles.logoText}>Bowel Max</Text>
        </View>
      </View>
    );
  }

  // Show loading while checking user status
  if (loading || isChecking) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If user exists, go to home, otherwise go to new onboarding landing
  if (user) {
    return <Redirect href="/(tabs)/(home)" />;
  } else {
    return <Redirect href="/onboarding/landing" />;
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poopIcon: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1,
  },
});
