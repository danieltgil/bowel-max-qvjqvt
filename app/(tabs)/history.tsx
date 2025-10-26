
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, RefreshControl } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/app/integrations/supabase/client";

export default function HistoryScreen() {
  const { userId } = useUser();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "History",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      
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

        {/* Entries List */}
        <View style={styles.entriesSection}>
          <Text style={styles.sectionTitle}>All Entries</Text>
          
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Pressable key={entry.id} style={styles.entryCard}>
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
                      <IconSymbol name="drop.fill" color={colors.info} size={16} />
                      <Text style={styles.entryDetailText}>{entry.hydration_level}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyState}>
              <IconSymbol name="tray" color={colors.textSecondary} size={60} />
              <Text style={styles.emptyStateText}>No entries yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your gut health by uploading your first photo!
              </Text>
            </View>
          )}
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
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
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
    backgroundColor: colors.cardBackground,
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
