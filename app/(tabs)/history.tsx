
import React, { useState, useEffect, useMemo } from "react";
import { Stack, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/app/integrations/supabase/client";
import Svg, { Path } from 'react-native-svg';

export default function HistoryScreen() {
  const { userId } = useUser();
  const { colors } = useTheme();
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateEntries, setSelectedDateEntries] = useState<any[]>([]);

  const renderHeaderLeft = () => (
    <View style={styles.headerLogo}>
      <Svg width={30} height={36} viewBox="0 0 100 120" style={{ marginRight: 8, backgroundColor: 'transparent' }}>
        <Path
          d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
          fill={colors.text}
        />
      </Svg>
      <Text style={styles.headerTitle}>Bowel Max</Text>
    </View>
  );

  useEffect(() => {
    if (userId) {
      loadEntries();
    }
  }, [userId]);

  const loadEntries = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('poop_entries')
        .select('*')
        .eq('user_id', userId)
        .order('entry_date', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      setEntries(data || []);
      
      // Create a set of dates that have entries
      const datesWithEntries = new Set<string>();
      data?.forEach(entry => {
        if (entry.entry_date) {
          const date = new Date(entry.entry_date);
          const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          datesWithEntries.add(dateKey);
        }
      });
      setCalendarData(datesWithEntries);
    } catch (err) {
      console.error('Unexpected error loading entries:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEntries();
  };

  const handleDayPress = (dateKey: string) => {
    setSelectedDate(dateKey);
    // Get entries for the selected date
    const dayEntries = entries.filter(entry => {
      if (!entry.entry_date) return false;
      const entryDate = new Date(entry.entry_date);
      const entryDateKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
      return entryDateKey === dateKey;
    });
    setSelectedDateEntries(dayEntries);
  };

  const getBristolColor = (type: number | null) => {
    if (!type) return colors.textSecondary;
    if (type <= 2) return colors.error;
    if (type <= 4) return colors.success;
    return colors.warning;
  };

  const getBristolLabel = (type: number | null) => {
    if (!type) return 'Not analyzed';
    if (type <= 2) return 'Constipation';
    if (type <= 4) return 'Ideal';
    return 'Diarrhea';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEntry = calendarData.has(dateKey);
      days.push({ day, dateKey, hasEntry });
    }

    return (
      <View style={styles.calendarContainer}>
        {/* Month Header */}
        <View style={styles.calendarHeader}>
          <Pressable 
            onPress={() => setCurrentDate(new Date(year, month - 1, 1))}
            style={styles.calendarNavButton}
          >
            <IconSymbol name="chevron.left" size={20} color={colors.textSecondary} />
          </Pressable>
          <Text style={styles.calendarMonth}>{monthNames[month]} {year}</Text>
          <Pressable 
            onPress={() => setCurrentDate(new Date(year, month + 1, 1))}
            style={styles.calendarNavButton}
          >
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Day Names */}
        <View style={styles.calendarDayNames}>
          {dayNames.map((day) => (
            <View key={day} style={styles.calendarDayName}>
              <Text style={styles.calendarDayNameText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((dayData, index) => (
            <View key={index} style={styles.calendarDay}>
              {dayData && (
                <Pressable
                  onPress={() => handleDayPress(dayData.dateKey)}
                  style={[
                    styles.calendarDayButton,
                    dayData.hasEntry && styles.calendarDayButtonActive,
                    selectedDate === dayData.dateKey && styles.calendarDayButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.calendarDayText,
                    dayData.hasEntry && styles.calendarDayTextActive,
                    selectedDate === dayData.dateKey && styles.calendarDayTextSelected
                  ]}>
                    {dayData.day}
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerLeft: renderHeaderLeft,
        }}
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
        >
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{entries.length}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {entries.filter(e => e.bristol_type && e.bristol_type >= 3 && e.bristol_type <= 4).length}
            </Text>
            <Text style={styles.statLabel}>Ideal</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {entries.length > 0 ? Math.round((entries.filter(e => e.bristol_type && e.bristol_type >= 3 && e.bristol_type <= 4).length / entries.length) * 100) : 0}%
            </Text>
            <Text style={styles.statLabel}>Health Score</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Calendar</Text>
          {renderCalendar()}
        </View>

        {/* Selected Date Entries */}
        {selectedDate && (
          <View style={styles.entriesSection}>
            <Text style={styles.sectionTitle}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Text>
            
            {selectedDateEntries.length > 0 ? (
              selectedDateEntries.map((entry) => (
                <Pressable
                  key={entry.id}
                  style={styles.entryCard}
                  onPress={() => router.push(`/analysis?entryId=${entry.id}`)}
                >
                  <View style={styles.entryHeader}>
                    <View style={[styles.bristolIndicator, { backgroundColor: getBristolColor(entry.bristol_type) }]} />
                    <View style={styles.entryContent}>
                      <Text style={styles.entryDate}>{formatDate(entry.entry_date)}</Text>
                      <Text style={styles.entryType}>
                        {entry.bristol_type ? `Bristol Type ${entry.bristol_type}` : 'Not analyzed'}
                      </Text>
                    </View>
                    <View style={styles.entryBadge}>
                      <Text style={[styles.entryBadgeText, { color: getBristolColor(entry.bristol_type) }]}>
                        {getBristolLabel(entry.bristol_type)}
                      </Text>
                    </View>
                  </View>
                  
                  {entry.notes && (
                    <View style={styles.entryNotes}>
                      <Text style={styles.entryNotesText}>{entry.notes}</Text>
                    </View>
                  )}

                  <View style={styles.entryDetails}>
                    {entry.color && (
                      <View style={styles.entryDetail}>
                        <IconSymbol name="paintpalette.fill" color={colors.textSecondary} size={16} />
                        <Text style={styles.entryDetailText}>{entry.color}</Text>
                      </View>
                    )}
                    {entry.hydration_level && (
                      <View style={styles.entryDetail}>
                        <IconSymbol name="drop.fill" color={colors.primaryDark} size={16} />
                        <Text style={styles.entryDetailText}>{entry.hydration_level}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <IconSymbol name="tray" color={colors.textSecondary} size={60} />
                <Text style={styles.emptyStateText}>No entries for this date</Text>
              </View>
            )}
          </View>
        )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  calendarSection: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  calendarContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 4,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  calendarDayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarDayName: {
    flex: 1,
    alignItems: 'center',
  },
  calendarDayNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  calendarDayButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  calendarDayButtonActive: {
    backgroundColor: colors.primary,
  },
  calendarDayButtonSelected: {
    backgroundColor: colors.primaryDark,
    borderWidth: 2,
    borderColor: colors.text,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  calendarDayTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  calendarDayTextSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  entriesSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bristolIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  entryContent: {
    flex: 1,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  entryType: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  entryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  entryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  entryNotes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  entryNotesText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  entryDetails: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  entryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
