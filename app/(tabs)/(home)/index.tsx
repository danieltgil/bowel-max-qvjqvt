
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, Animated } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleUploadPhoto = async () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image selected:', result.assets[0].uri);
      // Navigate to analysis screen
      router.push('/analysis');
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      console.log('Camera permission denied');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Photo taken:', result.assets[0].uri);
      router.push('/analysis');
    }
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log('Settings pressed')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.text} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Bowel Max",
            headerRight: renderHeaderRight,
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTitleStyle: {
              color: colors.text,
              fontWeight: '700',
            },
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.subtitle}>Ready to check your gut health?</Text>
          </View>

          {/* Main Upload Button */}
          <Animated.View style={[styles.uploadButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable
              style={styles.uploadButton}
              onPress={handleUploadPhoto}
            >
              <View style={styles.uploadIconContainer}>
                <IconSymbol name="camera.fill" color={colors.text} size={48} />
              </View>
              <Text style={styles.uploadButtonText}>Upload Stool Photo</Text>
              <Text style={styles.uploadButtonSubtext}>Tap to select from gallery</Text>
            </Pressable>
          </Animated.View>

          {/* Camera Button */}
          <Pressable
            style={styles.cameraButton}
            onPress={handleTakePhoto}
          >
            <IconSymbol name="camera" color={colors.text} size={20} />
            <Text style={styles.cameraButtonText}>Take Photo Now</Text>
          </Pressable>

          {/* Summary Cards */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Recent Summary</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <View style={[styles.summaryIcon, { backgroundColor: colors.success + '20' }]}>
                  <IconSymbol name="checkmark.circle.fill" color={colors.success} size={24} />
                </View>
                <View style={styles.summaryCardContent}>
                  <Text style={styles.summaryCardTitle}>Last Analysis</Text>
                  <Text style={styles.summaryCardValue}>Normal</Text>
                </View>
              </View>
              <Text style={styles.summaryCardDate}>2 days ago</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '20' }]}>
                  <IconSymbol name="drop.fill" color={colors.warning} size={24} />
                </View>
                <View style={styles.summaryCardContent}>
                  <Text style={styles.summaryCardTitle}>Hydration Level</Text>
                  <Text style={[styles.summaryCardValue, { color: colors.warning }]}>Low</Text>
                </View>
              </View>
              <Text style={styles.summaryCardDate}>Drink more water today!</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryCardHeader}>
                <View style={[styles.summaryIcon, { backgroundColor: colors.primary + '40' }]}>
                  <IconSymbol name="chart.line.uptrend.xyaxis" color={colors.primaryDark} size={24} />
                </View>
                <View style={styles.summaryCardContent}>
                  <Text style={styles.summaryCardTitle}>Weekly Trend</Text>
                  <Text style={[styles.summaryCardValue, { color: colors.success }]}>Improving</Text>
                </View>
              </View>
              <Text style={styles.summaryCardDate}>Keep up the good work! 💪</Text>
            </View>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <IconSymbol name="lock.fill" color={colors.textLight} size={16} />
            <Text style={styles.privacyText}>
              All photos are analyzed securely and never shared
            </Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  headerButtonContainer: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    marginBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  uploadButtonContainer: {
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(167, 243, 208, 0.4)',
    elevation: 6,
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  cameraButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryCardContent: {
    flex: 1,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  summaryCardValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryCardDate: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textLight,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  privacyText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textLight,
    marginLeft: 6,
  },
});
