
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function InsightsScreen() {
  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Insights",
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
            <Text style={styles.title}>Your Gut Insights</Text>
            <Text style={styles.subtitle}>Personalized health recommendations</Text>
          </View>

          {/* Weekly Digest */}
          <View style={styles.digestCard}>
            <View style={styles.digestHeader}>
              <View style={styles.digestIconContainer}>
                <IconSymbol name="sparkles" color={colors.text} size={28} />
              </View>
              <Text style={styles.digestTitle}>Weekly Digest</Text>
            </View>
            <Text style={styles.digestMessage}>
              Your gut is trending healthier! 🎉
            </Text>
            <Text style={styles.digestDescription}>
              You&apos;ve maintained consistent hydration and fiber intake this week. Keep it up!
            </Text>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="chart.line.uptrend.xyaxis" color={colors.success} size={24} />
                <Text style={styles.metricTitle}>Consistency Score</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>85%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '85%', backgroundColor: colors.success }]} />
                </View>
              </View>
              <Text style={styles.metricDescription}>
                Excellent! Your digestive system is working well.
              </Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="drop.fill" color={colors.primaryDark} size={24} />
                <Text style={styles.metricTitle}>Hydration Level</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>65%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '65%', backgroundColor: colors.warning }]} />
                </View>
              </View>
              <Text style={styles.metricDescription}>
                Try to drink 2-3 more glasses of water daily.
              </Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="leaf.fill" color={colors.success} size={24} />
                <Text style={styles.metricTitle}>Fiber Intake</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>78%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '78%', backgroundColor: colors.success }]} />
                </View>
              </View>
              <Text style={styles.metricDescription}>
                Great job! You&apos;re getting enough fiber.
              </Text>
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Text style={styles.recommendationEmoji}>💧</Text>
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Increase Water Intake</Text>
                <Text style={styles.recommendationDescription}>
                  Aim for 8 glasses per day to improve hydration
                </Text>
              </View>
            </View>

            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Text style={styles.recommendationEmoji}>🥗</Text>
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Add More Vegetables</Text>
                <Text style={styles.recommendationDescription}>
                  Include leafy greens in your meals for better digestion
                </Text>
              </View>
            </View>

            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Text style={styles.recommendationEmoji}>🚶‍♂️</Text>
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Stay Active</Text>
                <Text style={styles.recommendationDescription}>
                  Regular exercise helps maintain healthy digestion
                </Text>
              </View>
            </View>
          </View>

          {/* Health Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <IconSymbol name="lightbulb.fill" color={colors.warning} size={24} />
              <Text style={styles.tipsTitle}>Did You Know?</Text>
            </View>
            <Text style={styles.tipsText}>
              The Bristol Stool Scale is a medical tool used to classify stool into seven types. 
              Types 3 and 4 are considered ideal, indicating healthy digestion.
            </Text>
          </View>

          {/* Weekly Comparison */}
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>This Week vs Last Week</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Normal Logs</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>9</Text>
                  <IconSymbol name="arrow.up" color={colors.success} size={16} />
                  <Text style={[styles.comparisonChange, { color: colors.success }]}>+2</Text>
                </View>
              </View>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Avg. Hydration</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>65%</Text>
                  <IconSymbol name="arrow.down" color={colors.error} size={16} />
                  <Text style={[styles.comparisonChange, { color: colors.error }]}>-5%</Text>
                </View>
              </View>
            </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  digestCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  digestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  digestIconContainer: {
    marginRight: 12,
  },
  digestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  digestMessage: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  digestDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  metricContent: {
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 24,
  },
  recommendationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  recommendationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recommendationEmoji: {
    fontSize: 28,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: colors.highlight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  comparisonCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  comparisonValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginRight: 8,
  },
  comparisonChange: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 4,
  },
});
