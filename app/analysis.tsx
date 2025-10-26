
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function AnalysisScreen() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Start loading animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();

    // Simulate AI analysis
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bristolTypes = [
    { type: 1, name: 'Type 1', description: 'Separate hard lumps' },
    { type: 2, name: 'Type 2', description: 'Lumpy and sausage-like' },
    { type: 3, name: 'Type 3', description: 'Sausage with cracks' },
    { type: 4, name: 'Type 4', description: 'Smooth and soft' },
    { type: 5, name: 'Type 5', description: 'Soft blobs' },
    { type: 6, name: 'Type 6', description: 'Mushy consistency' },
    { type: 7, name: 'Type 7', description: 'Liquid consistency' },
  ];

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[
              styles.loadingIcon,
              {
                transform: [{ rotate: spin }, { scale: scaleAnim }],
              },
            ]}
          >
            <IconSymbol name="sparkles" color={colors.primary} size={64} />
          </Animated.View>
          <Text style={styles.loadingTitle}>Analyzing your sample...</Text>
          <Text style={styles.loadingSubtitle}>This will only take a moment</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.loadingDot, styles.loadingDot1]} />
            <View style={[styles.loadingDot, styles.loadingDot2]} />
            <View style={[styles.loadingDot, styles.loadingDot3]} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIconContainer}>
            <IconSymbol name="checkmark.circle.fill" color={colors.success} size={64} />
          </View>
          <Text style={styles.successTitle}>Analysis Complete!</Text>
          <Text style={styles.successSubtitle}>Healthy digestion incoming 💩</Text>
        </View>

        {/* Results Card */}
        <View style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Your Results</Text>

          {/* Bristol Scale Type */}
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <IconSymbol name="chart.bar.fill" color={colors.primaryDark} size={24} />
              <Text style={styles.resultLabel}>Bristol Stool Scale</Text>
            </View>
            <View style={styles.bristolTypeCard}>
              <Text style={styles.bristolType}>Type 4</Text>
              <Text style={styles.bristolDescription}>
                Smooth and soft, like a sausage or snake
              </Text>
              <View style={styles.bristolIllustration}>
                <View style={styles.bristolShape} />
              </View>
            </View>
          </View>

          {/* Color & Texture */}
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <IconSymbol name="paintpalette.fill" color={colors.secondary} size={24} />
              <Text style={styles.resultLabel}>Color & Texture</Text>
            </View>
            <View style={styles.colorRow}>
              <View style={styles.colorBlock}>
                <View style={[styles.colorSwatch, { backgroundColor: '#8B4513' }]} />
                <Text style={styles.colorLabel}>Brown</Text>
              </View>
              <View style={styles.colorBlock}>
                <View style={[styles.colorSwatch, { backgroundColor: '#D2B48C' }]} />
                <Text style={styles.colorLabel}>Normal</Text>
              </View>
            </View>
            <Text style={styles.colorDescription}>
              Healthy brown color indicates normal bile production
            </Text>
          </View>

          {/* Quick Insight */}
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <IconSymbol name="lightbulb.fill" color={colors.warning} size={24} />
              <Text style={styles.insightTitle}>Quick Insight</Text>
            </View>
            <Text style={styles.insightText}>
              Your stool appears normal and healthy! This indicates good digestive health 
              and adequate fiber intake. Keep up your current diet and hydration levels.
            </Text>
            <View style={styles.insightTags}>
              <View style={[styles.insightTag, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.insightTagText, { color: colors.success }]}>Normal</Text>
              </View>
              <View style={[styles.insightTag, { backgroundColor: colors.primary + '40' }]}>
                <Text style={[styles.insightTagText, { color: colors.primaryDark }]}>Good Hydration</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
          <View style={styles.recommendationItem}>
            <IconSymbol name="checkmark.circle" color={colors.success} size={20} />
            <Text style={styles.recommendationText}>
              Continue drinking 6-8 glasses of water daily
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <IconSymbol name="checkmark.circle" color={colors.success} size={20} />
            <Text style={styles.recommendationText}>
              Maintain your current fiber intake
            </Text>
          </View>
          <View style={styles.recommendationItem}>
            <IconSymbol name="checkmark.circle" color={colors.success} size={20} />
            <Text style={styles.recommendationText}>
              Regular exercise supports healthy digestion
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)/(home)/')}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Text style={styles.secondaryButtonText}>View History</Text>
          </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    marginBottom: 32,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 24,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginHorizontal: 4,
  },
  loadingDot1: {
    opacity: 0.3,
  },
  loadingDot2: {
    opacity: 0.6,
  },
  loadingDot3: {
    opacity: 1,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resultsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  bristolTypeCard: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  bristolType: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  bristolDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  bristolIllustration: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  bristolShape: {
    width: 120,
    height: 40,
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 12,
  },
  colorBlock: {
    alignItems: 'center',
  },
  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  colorDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  insightText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  insightTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  insightTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  insightTagText: {
    fontSize: 13,
    fontWeight: '700',
  },
  recommendationsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
