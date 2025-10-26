
import { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, ActivityIndicator, RefreshControl, Pressable, Dimensions } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/app/integrations/supabase/client";
import { Tables } from "@/app/integrations/supabase/types";
import { LineChart } from "react-native-chart-kit";
import { aiService, AIInsight } from "@/services/aiService";
import AIInsightsDisplay from "@/components/AIInsightsDisplay";

const screenWidth = Dimensions.get("window").width;

type PoopEntry = Tables<'poop_entries'>;
type User = Tables<'users'>;
type TimePeriod = '7d' | '30d' | '60d';

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

interface InsightsData {
  consistencyScore: number;
  recommendations: Array<{
    emoji: string;
    title: string;
    description: string;
  }>;
  weeklyComparison: {
    normalLogs: { current: number; change: number };
  };
  totalEntries: number;
  avgBristolType: number;
  healthyEntries: number;
  avgStoolCountPerDay: number;
  gutHealthTrend: number; // percentage change in consistency score
  chartData: {
    poopCount: ChartData;
  };
}

export default function InsightsScreen() {
  const router = useRouter();
  const { user, userId } = useUser();
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');

  const renderHeaderLeft = () => (
    <View style={styles.headerLogo}>
      <Text style={styles.headerTitle}>Insights</Text>
    </View>
  );

  useEffect(() => {
    if (userId) {
      loadInsightsData();
    }
  }, [userId, timePeriod]);

  const loadInsightsData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Calculate date range based on selected time period
      const daysAgo = timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 60;
      
      console.log('Loading insights for time period:', timePeriod);
      console.log('Days ago:', daysAgo);
      console.log('User ID:', userId);

      // Get all entries for this user (since test data is from 2024)
      const { data: allUserEntries, error: entriesError } = await supabase
        .from('poop_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: true });

      console.log('All user entries:', allUserEntries?.length || 0);
      
      // For demo purposes, let's use the most recent entries based on the time period
      // This will work with your 2024 test data
      const entries = allUserEntries?.slice(-daysAgo) || [];
      
      console.log('Using last', daysAgo, 'entries:', entries.length);

      console.log('Entries found:', entries?.length || 0);
      console.log('Entries data:', entries);

      if (entriesError) {
        console.error('Error loading entries:', entriesError);
        return;
      }

      // Get entries from previous period for comparison
      // For demo purposes, get the entries before the current period
      const previousEntries = allUserEntries?.slice(-(daysAgo * 2), -daysAgo) || [];
      
      console.log('Previous period entries:', previousEntries.length);

      const insights = calculateInsights(entries || [], previousEntries || [], user, timePeriod);
      setInsightsData(insights);
      
      // Load AI insights after regular insights are loaded
      if (entries && entries.length > 0 && user) {
        console.log('🎯 Calling loadAIInsights with:', { entriesCount: entries.length, userId: user.id, timePeriod });
        loadAIInsights(entries, user, timePeriod, insights);
      } else {
        console.log('❌ Not calling loadAIInsights:', { 
          hasEntries: !!entries, 
          entriesLength: entries?.length, 
          hasUser: !!user 
        });
      }
    } catch (err) {
      console.error('Unexpected error loading insights:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadAIInsights = async (entries: PoopEntry[], user: User, timePeriod: TimePeriod, insights: InsightsData) => {
    console.log('🚀 Starting AI insights loading...');
    console.log('📊 Data:', { entriesCount: entries.length, user: user?.name, timePeriod });
    
    setAiLoading(true);
    try {
      console.log('Loading AI insights...');
      
      const aiData = {
        user,
        entries,
        timePeriod,
        insights: {
          consistencyScore: insights.consistencyScore,
          totalEntries: insights.totalEntries,
          avgBristolType: insights.avgBristolType,
          healthyEntries: insights.healthyEntries,
        }
      };

      console.log('📤 Sending data to AI service:', aiData);
      const aiAnalysis = await aiService.analyzeBowelHealth(aiData);
      console.log('✅ AI insights loaded successfully:', aiAnalysis);
      setAiInsights(aiAnalysis);
    } catch (error) {
      console.error('❌ Error loading AI insights:', error);
      // Fallback to mock insights
      try {
        console.log('🔄 Falling back to mock insights...');
        const mockInsights = await aiService.getMockInsights({
          user,
          entries,
          timePeriod,
          insights: {
            consistencyScore: insights.consistencyScore,
            totalEntries: insights.totalEntries,
            avgBristolType: insights.avgBristolType,
            healthyEntries: insights.healthyEntries,
          }
        });
        console.log('✅ Mock insights loaded:', mockInsights);
        setAiInsights(mockInsights);
      } catch (mockError) {
        console.error('❌ Error loading mock insights:', mockError);
      }
    } finally {
      setAiLoading(false);
      console.log('🏁 AI insights loading completed');
    }
  };

  const calculateInsights = (entries: PoopEntry[], previousEntries: PoopEntry[], user: User | null, period: TimePeriod): InsightsData => {
    console.log('Calculating insights for', entries.length, 'entries');
    console.log('Sample entries:', entries.slice(0, 3));
    
    const totalEntries = entries.length;
    const healthyEntries = entries.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;
    const consistencyScore = totalEntries > 0 ? Math.round((healthyEntries / totalEntries) * 100) : 0;
    
    console.log('Total entries:', totalEntries);
    console.log('Healthy entries:', healthyEntries);
    console.log('Consistency score:', consistencyScore);
    
    // Calculate average Bristol type
    const validBristolTypes = entries.filter(entry => entry.bristol_type).map(entry => entry.bristol_type!);
    const avgBristolType = validBristolTypes.length > 0 
      ? validBristolTypes.reduce((sum, type) => sum + type, 0) / validBristolTypes.length 
      : 0;

    // Calculate average stool count per day
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 60;
    const avgStoolCountPerDay = totalEntries > 0 ? Math.round((totalEntries / days) * 10) / 10 : 0;

    // Calculate gut health trend (percentage increase in healthy stool range)
    const previousHealthyEntries = previousEntries.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;
    const previousConsistencyScore = previousEntries.length > 0 ? Math.round((previousHealthyEntries / previousEntries.length) * 100) : 0;
    
    // Calculate percentage increase in healthy stool range
    let gutHealthTrend = 0;
    if (previousConsistencyScore > 0) {
      gutHealthTrend = Math.round(((consistencyScore - previousConsistencyScore) / previousConsistencyScore) * 100);
    } else if (consistencyScore > 0) {
      // If previous period had 0% healthy, but current has some, show 100% increase
      gutHealthTrend = 100;
    }

    // Generate recommendations
    const recommendations = generateRecommendations(consistencyScore, user);

    // Calculate weekly comparison
    const weeklyComparison = calculateWeeklyComparison(entries, previousEntries);

    // Generate chart data
    const chartData = generateChartData(entries, period);

    return {
      consistencyScore,
      recommendations,
      weeklyComparison,
      totalEntries,
      avgBristolType,
      healthyEntries,
      avgStoolCountPerDay,
      gutHealthTrend,
      chartData
    };
  };

  const generateRecommendations = (consistency: number, user: User | null) => {
    const recommendations = [];

    if (consistency < 70) {
      recommendations.push({
        emoji: "🥗",
        title: "Improve Consistency",
        description: "Include more fruits, vegetables, and whole grains in your diet"
      });
    }

    if (consistency < 50) {
      recommendations.push({
        emoji: "🌾",
        title: "Add More Fiber",
        description: "Switch to whole grain bread, pasta, and rice for better bowel health"
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        emoji: "🚶‍♂️",
        title: "Stay Active",
        description: "Regular exercise helps maintain healthy digestion"
      });
    }

    return recommendations;
  };

  const calculateWeeklyComparison = (currentEntries: PoopEntry[], previousEntries: PoopEntry[]) => {
    const currentHealthy = currentEntries.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;
    const previousHealthy = previousEntries.filter(entry => entry.bristol_type && entry.bristol_type >= 3 && entry.bristol_type <= 4).length;

    return {
      normalLogs: {
        current: currentHealthy,
        change: currentHealthy - previousHealthy
      }
    };
  };

  const generateChartData = (entries: PoopEntry[], period: TimePeriod) => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 60;
    const labels = [];
    const poopCountData = [];

    console.log('Generating chart data for', entries.length, 'entries over', days, 'days');

    // Generate labels based on period
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      if (period === '7d') {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else if (period === '30d') {
        labels.push(date.getDate().toString());
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }

    // Process data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayEntries = entries.filter(entry => entry.entry_date === dateStr);
      
      // Count entries for the day
      poopCountData.push(dayEntries.length);
      
      if (dayEntries.length > 0) {
        console.log(`Day ${dateStr}: ${dayEntries.length} entries`);
      }
    }

    console.log('Chart data generated:', {
      labels: labels.length,
      poopCountData,
    });

    return {
      poopCount: {
        labels,
        datasets: [{
          data: poopCountData,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // success color
          strokeWidth: 2
        }]
      },
    };
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInsightsData();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your insights...</Text>
      </View>
    );
  }

  if (!insightsData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>Start logging entries to see your insights</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: Platform.OS === 'ios',
          title: "",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerLeft: renderHeaderLeft,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Gut Insights</Text>
            <Text style={styles.subtitle}>Based on {insightsData.totalEntries} entries</Text>
          </View>

          {/* AI Insights Section */}
          <AIInsightsDisplay aiInsights={aiInsights} aiLoading={aiLoading} />

          {/* Chat with Dr. Gut Button */}
          <Pressable 
            style={styles.chatButton}
            onPress={() => router.push('/chat')}
          >
            <View style={styles.chatButtonContent}>
              <View style={styles.chatButtonLeft}>
                <View style={styles.chatIconContainer}>
                  <IconSymbol name="message.fill" color="white" size={20} />
                </View>
                <View style={styles.chatButtonText}>
                  <Text style={styles.chatButtonTitle}>Chat with Dr. Gut</Text>
                  <Text style={styles.chatButtonSubtitle}>Ask questions about your gut health</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" color={colors.textSecondary} size={16} />
            </View>
          </Pressable>

          {/* Time Period Toggle */}
          <View style={styles.timePeriodContainer}>
            <Text style={styles.timePeriodLabel}>Time Period:</Text>
            <View style={styles.timePeriodButtons}>
              {(['7d', '30d', '60d'] as TimePeriod[]).map((period) => (
                <Pressable
                  key={period}
                  style={[
                    styles.timePeriodButton,
                    timePeriod === period && styles.timePeriodButtonActive
                  ]}
                  onPress={() => setTimePeriod(period)}
                >
                  <Text style={[
                    styles.timePeriodButtonText,
                    timePeriod === period && styles.timePeriodButtonTextActive
                  ]}>
                    {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '60 Days'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>


          {/* Key Metrics */}
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            
            {/* Consistency Score - Just the number */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="chart.line.uptrend.xyaxis" color={getScoreColor(insightsData.consistencyScore)} size={24} />
                <Text style={styles.metricTitle}>Consistency Score</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>{insightsData.consistencyScore}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${insightsData.consistencyScore}%`, backgroundColor: getScoreColor(insightsData.consistencyScore) }]} />
                </View>
              </View>
              <Text style={styles.metricDescription}>
                {insightsData.healthyEntries} of {insightsData.totalEntries} entries were in the healthy range (Bristol 3-4)
              </Text>
            </View>

            {/* Additional Key Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricGridItem}>
                <Text style={styles.metricGridValue}>{insightsData.avgStoolCountPerDay}</Text>
                <Text style={styles.metricGridLabel}>Avg Stools/Day</Text>
              </View>
              <View style={styles.metricGridItem}>
                <Text style={styles.metricGridValue}>{insightsData.avgBristolType.toFixed(1)}</Text>
                <Text style={styles.metricGridLabel}>Avg Bristol Type</Text>
              </View>
              <View style={styles.metricGridItem}>
                <Text style={[styles.metricGridValue, { color: insightsData.gutHealthTrend >= 0 ? colors.success : colors.error }]}>
                  {insightsData.gutHealthTrend >= 0 ? '+' : ''}{insightsData.gutHealthTrend}%
                </Text>
                <Text style={styles.metricGridLabel}>Healthy Stool Increase</Text>
              </View>
              <View style={styles.metricGridItem}>
                <Text style={styles.metricGridValue}>{insightsData.totalEntries}</Text>
                <Text style={styles.metricGridLabel}>Total Entries</Text>
              </View>
            </View>

            {/* Poop Count Chart */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <IconSymbol name="chart.bar.fill" color={colors.primary} size={24} />
                <Text style={styles.metricTitle}>Daily Stool Count</Text>
              </View>
              <View style={styles.chartContainer}>
                <LineChart
                  data={insightsData.chartData.poopCount}
                  width={screenWidth - 80}
                  height={120}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: 'transparent',
                    backgroundGradientTo: 'transparent',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "4",
                      strokeWidth: "2",
                      stroke: colors.success
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              </View>
              <Text style={styles.metricDescription}>
                Number of bowel movements recorded each day
              </Text>
            </View>

          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            
            {insightsData.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recommendationIcon}>
                  <Text style={styles.recommendationEmoji}>{rec.emoji}</Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationDescription}>
                    {rec.description}
                  </Text>
                </View>
              </View>
            ))}
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
            <Text style={styles.comparisonTitle}>This Month vs Last Month</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Text style={styles.comparisonLabel}>Healthy Entries</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>{insightsData.weeklyComparison.normalLogs.current}</Text>
                  {insightsData.weeklyComparison.normalLogs.change !== 0 && (
                    <>
                      <IconSymbol 
                        name={insightsData.weeklyComparison.normalLogs.change > 0 ? "arrow.up" : "arrow.down"} 
                        color={insightsData.weeklyComparison.normalLogs.change > 0 ? colors.success : colors.error} 
                        size={16} 
                      />
                      <Text style={[styles.comparisonChange, { 
                        color: insightsData.weeklyComparison.normalLogs.change > 0 ? colors.success : colors.error 
                      }]}>
                        {insightsData.weeklyComparison.normalLogs.change > 0 ? '+' : ''}{insightsData.weeklyComparison.normalLogs.change}
                      </Text>
                    </>
                  )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timePeriodContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  timePeriodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  timePeriodButtons: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  timePeriodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePeriodButtonActive: {
    backgroundColor: colors.primary,
  },
  timePeriodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  timePeriodButtonTextActive: {
    color: colors.text,
  },
  chartContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  metricGridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricGridValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  metricGridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // AI Insights Styles
  aiInsightsCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  aiTitleContainer: {
    flex: 1,
  },
  aiInsightsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  aiSummaryCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  aiSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  aiSummaryContent: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
  },
  aiSectionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  concernCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  aiSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  aiListContainer: {
    gap: 8,
  },
  aiListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  aiBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    marginTop: 8,
    flexShrink: 0,
  },
  recommendationBullet: {
    backgroundColor: colors.primary,
  },
  positiveBullet: {
    backgroundColor: colors.success,
  },
  concernBullet: {
    backgroundColor: colors.error,
  },
  aiListText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
  },
  concernText: {
    color: colors.error,
    fontWeight: '600',
  },
  aiLoadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  chatButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  chatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    flex: 1,
  },
  chatButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  chatButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
