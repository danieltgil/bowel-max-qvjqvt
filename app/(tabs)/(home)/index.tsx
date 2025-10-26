
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Animated, Alert } from "react-native";
import { colors } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { useRouter } from 'expo-router';
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/app/integrations/supabase/client";
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user, userId } = useUser();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      loadRecentEntries();
    }
  }, [userId]);

  const loadRecentEntries = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('poop_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      setRecentEntries(data || []);
    } catch (err) {
      console.error('Unexpected error loading entries:', err);
    }
  };


  const handleUploadPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
      return;
    }

    // Navigate to custom camera screen
    router.push('/camera');
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderHeaderLeft = () => (
    <View style={styles.headerLogo}>
      <Svg width={30} height={36} viewBox="0 0 100 120" style={{ marginRight: 8 }}>
        <Path
          d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
          fill="#000000"
        />
      </Svg>
      <Text style={styles.headerTitle}>Bowel Max</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: renderHeaderLeft,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        {user && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Hello, {user.name}! 👋</Text>
            <Text style={styles.welcomeSubtext}>Ready to track your gut health?</Text>
          </View>
        )}

        {/* Main Upload Button */}
        <Animated.View style={[styles.uploadButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Pressable
            style={styles.uploadButton}
            onPress={handleUploadPhoto}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <View style={styles.uploadIconContainer}>
              <IconSymbol name="camera.fill" color={colors.text} size={40} />
            </View>
            <Text style={styles.uploadButtonText}>Capture Stool Photo</Text>
            <Text style={styles.uploadButtonSubtext}>Tap to take a photo</Text>
          </Pressable>
        </Animated.View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <View key={entry.id} style={styles.summaryCard}>
                <View style={styles.summaryCardHeader}>
                  <View style={styles.summaryCardIcon}>
                    <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
                  </View>
                  <View style={styles.summaryCardContent}>
                    <Text style={styles.summaryCardTitle}>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.summaryCardSubtitle}>
                      {entry.bristol_type ? `Type ${entry.bristol_type}` : 'Analysis complete'}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <IconSymbol name="tray" color={colors.textSecondary} size={40} />
              <Text style={styles.emptyCardText}>No entries yet</Text>
              <Text style={styles.emptyCardSubtext}>Upload your first photo to get started!</Text>
            </View>
          )}
        </View>

        {/* Health Stats */}
        {user && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Your Health Profile</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <IconSymbol name="drop.fill" color={colors.info} size={28} />
                <Text style={styles.statValue}>{user.hydration_glasses || 0}</Text>
                <Text style={styles.statLabel}>Glasses/day</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol name="leaf.fill" color={colors.success} size={28} />
                <Text style={styles.statValue}>{user.diet_type?.split(' ')[0] || 'N/A'}</Text>
                <Text style={styles.statLabel}>Fiber</Text>
              </View>

              <View style={styles.statCard}>
                <IconSymbol name="clock.fill" color={colors.warning} size={28} />
                <Text style={styles.statValue}>{user.restroom_frequency?.split(' ')[0] || 'N/A'}</Text>
                <Text style={styles.statLabel}>Frequency</Text>
              </View>
            </View>
          </View>
        )}

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <IconSymbol name="lock.fill" color={colors.success} size={20} />
          <Text style={styles.privacyText}>
            All photos are analyzed securely and never shared
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  uploadButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(167, 243, 208, 0.4)',
    elevation: 8,
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    opacity: 0.8,
  },
  summarySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCardIcon: {
    marginRight: 12,
  },
  summaryCardContent: {
    flex: 1,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  summaryCardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  emptyCardText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyCardSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 8,
    textAlign: 'center',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
});
