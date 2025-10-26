import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { AIInsight } from '@/services/aiService';
import HealthOverviewCard from './HealthOverviewCard';
import AIInsightCard from './AIInsightCard';

interface AIInsightsDisplayProps {
  aiInsights: AIInsight | null;
  aiLoading: boolean;
}

const AIInsightsDisplay: React.FC<AIInsightsDisplayProps> = ({ aiInsights, aiLoading }) => {
  if (aiLoading && !aiInsights) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Health Insights</Text>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
        <Text style={styles.loadingText}>Analyzing your patterns...</Text>
      </View>
    );
  }

  if (!aiInsights) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Health Insights</Text>
        <Text style={styles.subtitle}>Tap any card to explore detailed insights</Text>
        {aiLoading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>
      
      {/* Health Overview */}
      <HealthOverviewCard summary={aiInsights.summary} />

      {/* Key Patterns */}
      <AIInsightCard
        title="Key Patterns"
        emoji="🔍"
        items={aiInsights.patterns}
        bulletColor={colors.textSecondary}
      />

      {/* Recommendations */}
      <AIInsightCard
        title="Recommended Actions"
        emoji="💡"
        items={aiInsights.recommendations}
        bulletColor={colors.primary}
      />

      {/* Positive Trends */}
      <AIInsightCard
        title="Positive Trends"
        emoji="📈"
        items={aiInsights.positiveTrends}
        bulletColor={colors.success}
      />

      {/* Concerns */}
      <AIInsightCard
        title="Things to Watch"
        emoji="⚠️"
        items={aiInsights.concerns}
        bulletColor={colors.error}
        textColor={colors.error}
        isConcern={true}
      />
    </View>
  );
};

const styles = {
  container: {
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center' as const,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 8,
    fontWeight: '500' as const,
  },
};

export default AIInsightsDisplay;
