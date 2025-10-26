
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { colors } from '@/styles/commonStyles';

export default function Index() {
  const { user, loading } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give the UserContext time to load
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  // If user exists, go to home, otherwise go to onboarding
  if (user) {
    return <Redirect href="/(tabs)/(home)/" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
