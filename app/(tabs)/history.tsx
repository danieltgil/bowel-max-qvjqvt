
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function HistoryScreen() {
  const historyData = [
    {
      id: '1',
      date: '2 days ago',
      fullDate: 'Jan 15, 2025',
      type: 'Type 4',
      color: 'Brown',
      status: 'Normal',
      statusColor: colors.success,
      icon: 'checkmark.circle.fill',
    },
    {
      id: '2',
      date: '5 days ago',
      fullDate: 'Jan 12, 2025',
      type: 'Type 3',
      color: 'Dark Brown',
      status: 'Dehydrated',
      statusColor: colors.warning,
      icon: 'exclamationmark.triangle.fill',
    },
    {
      id: '3',
      date: '1 week ago',
      fullDate: 'Jan 8, 2025',
      type: 'Type 4',
      color: 'Brown',
      status: 'Normal',
      statusColor: colors.success,
      icon: 'checkmark.circle.fill',
    },
    {
      id: '4',
      date: '1 week ago',
      fullDate: 'Jan 6, 2025',
      type: 'Type 5',
      color: 'Light Brown',
      status: 'High Fiber',
      statusColor: colors.success,
      icon: 'checkmark.circle.fill',
    },
  ];

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "History",
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
            <Text style={styles.title}>Your Log History</Text>
            <Text style={styles.subtitle}>Track your digestive health over time</Text>
          </View>

          {/* Trend Summary */}
          <View style={styles.trendCard}>
            <Text style={styles.trendTitle}>This Month</Text>
            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatValue}>12</Text>
                <Text style={styles.trendStatLabel}>Total Logs</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={[styles.trendStatValue, { color: colors.success }]}>75%</Text>
                <Text style={styles.trendStatLabel}>Normal</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={[styles.trendStatValue, { color: colors.warning }]}>25%</Text>
                <Text style={styles.trendStatLabel}>Attention</Text>
              </View>
            </View>
          </View>

          {/* Frequency Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Stool Type Frequency</Text>
            <View style={styles.chartBars}>
              <View style={styles.chartBar}>
                <View style={[styles.chartBarFill, { height: '30%', backgroundColor: colors.textLight }]} />
                <Text style={styles.chartBarLabel}>Type 3</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartBarFill, { height: '70%', backgroundColor: colors.primary }]} />
                <Text style={styles.chartBarLabel}>Type 4</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartBarFill, { height: '20%', backgroundColor: colors.secondary }]} />
                <Text style={styles.chartBarLabel}>Type 5</Text>
              </View>
              <View style={styles.chartBar}>
                <View style={[styles.chartBarFill, { height: '10%', backgroundColor: colors.textLight }]} />
                <Text style={styles.chartBarLabel}>Type 6</Text>
              </View>
            </View>
          </View>

          {/* History List */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Logs</Text>
            {historyData.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyCardLeft}>
                  <View style={[styles.historyIcon, { backgroundColor: item.statusColor + '20' }]}>
                    <IconSymbol name={item.icon as any} color={item.statusColor} size={24} />
                  </View>
                  <View style={styles.historyCardContent}>
                    <Text style={styles.historyCardDate}>{item.date}</Text>
                    <Text style={styles.historyCardFullDate}>{item.fullDate}</Text>
                  </View>
                </View>
                <View style={styles.historyCardRight}>
                  <Text style={styles.historyCardType}>{item.type}</Text>
                  <Text style={[styles.historyCardStatus, { color: item.statusColor }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Hydration Trend */}
          <View style={styles.hydrationCard}>
            <View style={styles.hydrationHeader}>
              <IconSymbol name="drop.fill" color={colors.primaryDark} size={24} />
              <Text style={styles.hydrationTitle}>Hydration Trend</Text>
            </View>
            <View style={styles.hydrationGraph}>
              {[60, 45, 70, 55, 40, 65, 50].map((height, index) => (
                <View key={index} style={styles.hydrationBar}>
                  <View
                    style={[
                      styles.hydrationBarFill,
                      {
                        height: `${height}%`,
                        backgroundColor: height > 60 ? colors.success : colors.warning,
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.hydrationLabels}>
              <Text style={styles.hydrationLabel}>Mon</Text>
              <Text style={styles.hydrationLabel}>Tue</Text>
              <Text style={styles.hydrationLabel}>Wed</Text>
              <Text style={styles.hydrationLabel}>Thu</Text>
              <Text style={styles.hydrationLabel}>Fri</Text>
              <Text style={styles.hydrationLabel}>Sat</Text>
              <Text style={styles.hydrationLabel}>Sun</Text>
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
  trendCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendStat: {
    alignItems: 'center',
  },
  trendStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  trendStatLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  chartBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  historySection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  historyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyCardContent: {
    flex: 1,
  },
  historyCardDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  historyCardFullDate: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  historyCardRight: {
    alignItems: 'flex-end',
  },
  historyCardType: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  historyCardStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
  hydrationCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  hydrationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  hydrationGraph: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  hydrationBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  hydrationBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  hydrationLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hydrationLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
