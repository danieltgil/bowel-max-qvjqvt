
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated, ScrollView, Alert, TextInput, Modal } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@/contexts/ThemeContext";
import { analyzeStoolImage, AnalysisResult } from "@/utils/imageAnalysis";
import { supabase } from "@/app/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

export default function AnalysisScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ photoUri?: string; entryId?: string }>();
  const { userId } = useUser();
  const { colors } = useTheme();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const styles = createStyles(colors);
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedResult, setEditedResult] = useState<AnalysisResult | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [isViewMode, setIsViewMode] = useState(false); // true if viewing existing entry
  const [entryDate, setEntryDate] = useState<string | null>(null);

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

    // Load existing entry or perform AI analysis
    const loadData = async () => {
      // If entryId is provided, load existing entry from Supabase
      if (params.entryId) {
        try {
          const { data, error } = await supabase
            .from('poop_entries')
            .select('*')
            .eq('id', params.entryId)
            .single();

          if (error || !data) {
            throw new Error('Entry not found');
          }

          // Map database entry to AnalysisResult format
          const result: AnalysisResult = {
            isPoop: true,
            bristol_type: data.bristol_type || 0,
            color: data.color || 'Brown',
            texture: data.texture || 'Normal',
            hydration_level: data.hydration_level || 'Adequate',
            ai_insight: data.ai_insight || '',
          };

          setAnalysisResult(result);
          setEditedResult(result);
          setUserNotes(data.notes || '');
          setEntryDate(data.entry_date);
          setIsViewMode(true); // Viewing existing entry
          setIsAnalyzing(false);
        } catch (err) {
          console.error('Error loading entry:', err);
          setError('Failed to load entry');
          setIsAnalyzing(false);
          Alert.alert('Error', 'Failed to load entry', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        }
      }
      // Otherwise, analyze new photo
      else if (params.photoUri) {
        try {
          // Analyze the image
          const result = await analyzeStoolImage(params.photoUri);

          // Check if it's actually poop
          if (!result.isPoop) {
            Alert.alert(
              'Invalid Image',
              'Please upload an actual stool photo for analysis.',
              [
                {
                  text: 'Retry',
                  onPress: () => router.back(),
                },
              ]
            );
            return;
          }

          setAnalysisResult(result);
          setEditedResult(result); // Initialize edited result with AI result
          setIsViewMode(false); // Creating new entry
          setIsAnalyzing(false);
        } catch (err) {
          console.error('Analysis error:', err);
          setError(err instanceof Error ? err.message : 'Failed to analyze image');
          setIsAnalyzing(false);
          Alert.alert(
            'Analysis Failed',
            'Unable to analyze the photo. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      } else {
        Alert.alert('Error', 'No photo or entry provided');
        router.back();
      }
    };

    loadData();
  }, [params.photoUri, params.entryId, userId]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const saveEntryToDatabase = async (result: AnalysisResult, photoUri: string, userNotesInput: string) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const { error } = await supabase
        .from('poop_entries')
        .insert({
          user_id: userId,
          photo_url: photoUri,
          bristol_type: result.bristol_type,
          color: result.color,
          texture: result.texture,
          hydration_level: result.hydration_level,
          ai_insight: result.ai_insight || null, // AI's health analysis
          notes: userNotesInput || null, // User's own notes
          entry_date: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving entry:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error saving to database:', err);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!editedResult) return;

    try {
      if (isViewMode && params.entryId) {
        // Update existing entry
        const { error } = await supabase
          .from('poop_entries')
          .update({
            bristol_type: editedResult.bristol_type,
            color: editedResult.color,
            texture: editedResult.texture,
            hydration_level: editedResult.hydration_level,
            notes: userNotes || null,
          })
          .eq('id', params.entryId);

        if (error) throw error;

        Alert.alert('Success', 'Entry updated!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/(home)') }
        ]);
      } else if (params.photoUri) {
        // Create new entry
        await saveEntryToDatabase(editedResult, params.photoUri, userNotes);
        Alert.alert('Success', 'Entry saved!', [
          { text: 'OK', onPress: () => router.push('/(tabs)/(home)') }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  const bristolTypeChoices = [
    { type: 1, name: 'Type 1', description: 'Hard, separate lumps' },
    { type: 2, name: 'Type 2', description: 'Lumpy sausage' },
    { type: 3, name: 'Type 3', description: 'Cracked sausage' },
    { type: 4, name: 'Type 4', description: 'Smooth sausage' },
    { type: 5, name: 'Type 5', description: 'Soft blobs' },
    { type: 6, name: 'Type 6', description: 'Mushy' },
    { type: 7, name: 'Type 7', description: 'Liquid' },
  ];

  const colorChoices = ['Brown', 'Dark Brown', 'Light Brown', 'Green', 'Yellow', 'Black', 'Red'];
  const textureChoices = ['Hard', 'Normal', 'Soft', 'Liquid', 'Mushy'];
  const hydrationChoices = ['Well Hydrated', 'Adequate', 'Dehydrated', 'Over-hydrated'];

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

  // Show error state if analysis failed
  if (error || !analysisResult) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <IconSymbol name="exclamationmark.triangle.fill" color={colors.error} size={64} />
          <Text style={styles.loadingTitle}>Analysis Failed</Text>
          <Text style={styles.loadingSubtitle}>{error || 'Something went wrong'}</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Back Button */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" color={colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isViewMode ? 'Entry Details' : 'Analysis Results'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Entry Date (for view mode) */}
        {isViewMode && entryDate && (
          <View style={styles.entryDateCard}>
            <IconSymbol name="calendar" color={colors.textSecondary} size={18} />
            <Text style={styles.entryDateText}>
              {new Date(entryDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}

        {/* Quick Summary Cards */}
        <View style={styles.quickSummaryGrid}>
          <View style={styles.summaryCard}>
            <IconSymbol name="chart.bar.fill" color={colors.primary} size={28} />
            <Text style={styles.summaryValue}>Type {(editedResult || analysisResult).bristol_type}</Text>
            <Text style={styles.summaryLabel}>Bristol</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <IconSymbol name="paintpalette.fill" color={colors.secondary} size={28} />
            <Text style={styles.summaryValue}>{(editedResult || analysisResult).color || 'Brown'}</Text>
            <Text style={styles.summaryLabel}>Color</Text>
          </View>

          <View style={styles.summaryCard}>
            <IconSymbol name="drop.fill" color={colors.primaryDark} size={28} />
            <Text style={styles.summaryValue} numberOfLines={1}>
              {(editedResult || analysisResult).texture || 'Normal'}
            </Text>
            <Text style={styles.summaryLabel}>Texture</Text>
          </View>

          <View style={styles.summaryCard}>
            <IconSymbol name="drop.fill" color={colors.success} size={28} />
            <Text style={styles.summaryValue} numberOfLines={2}>
              {(editedResult || analysisResult).hydration_level || 'Adequate'}
            </Text>
            <Text style={styles.summaryLabel}>Hydration</Text>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.notesCard}>
          <Text style={styles.notesLabel}>Add Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How was your experience? Any symptoms or observations?"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={userNotes}
            onChangeText={setUserNotes}
            numberOfLines={3}
          />
        </View>

        {/* AI Insight */}
        {analysisResult.ai_insight && (
          <View style={styles.insightCard}>
            <IconSymbol name="lightbulb.fill" color={colors.warning} size={20} />
            <Text style={styles.insightText}>
              {analysisResult.ai_insight}
            </Text>
          </View>
        )}

        {/* Show indicator if results were edited */}
        {editedResult && editedResult !== analysisResult && (
          <View style={styles.editedIndicator}>
            <IconSymbol name="pencil" color={colors.success} size={16} />
            <Text style={styles.editedIndicatorText}>Results modified</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.fixButton}
            onPress={() => setIsEditMode(true)}
          >
            <IconSymbol name="pencil" color={colors.text} size={20} />
            <Text style={styles.fixButtonText}>
              {isViewMode ? 'Edit Entry' : 'Fix Results'}
            </Text>
          </Pressable>
          {!isViewMode && (
            <Pressable
              style={styles.primaryButton}
              onPress={handleSave}
            >
              <Text style={styles.primaryButtonText}>Save</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditMode}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditMode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { paddingHorizontal: 24 }]}>
              <Text style={styles.modalTitle}>Edit Results</Text>
              <View style={styles.modalHeaderRight}>
                {isViewMode && editedResult && JSON.stringify(editedResult) !== JSON.stringify(analysisResult) && (
                  <Pressable
                    style={styles.headerSaveButton}
                    onPress={async () => {
                      await handleSave();
                      setIsEditMode(false);
                    }}
                  >
                    <Text style={styles.headerSaveButtonText}>Save Changes</Text>
                  </Pressable>
                )}
                {!isViewMode && editedResult && JSON.stringify(editedResult) !== JSON.stringify(analysisResult) && (
                  <Pressable
                    style={styles.headerSaveButton}
                    onPress={() => setIsEditMode(false)}
                  >
                    <Text style={styles.headerSaveButtonText}>Done</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => setIsEditMode(false)} style={styles.closeButton}>
                  <IconSymbol name="xmark" color={colors.text} size={24} />
                </Pressable>
              </View>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>

            {/* Bristol Type Picker */}
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Bristol Type</Text>
              <View style={styles.choiceGrid}>
                {bristolTypeChoices.map((choice) => (
                  <Pressable
                    key={choice.type}
                    style={[
                      styles.choiceButton,
                      editedResult?.bristol_type === choice.type && styles.choiceButtonSelected
                    ]}
                    onPress={() => setEditedResult({ ...editedResult!, bristol_type: choice.type })}
                  >
                    <Text style={[styles.choiceText, editedResult?.bristol_type === choice.type && styles.choiceTextSelected]}>
                      {choice.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Color Picker */}
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Color</Text>
              <View style={styles.choiceGrid}>
                {colorChoices.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.choiceButton,
                      editedResult?.color === color && styles.choiceButtonSelected
                    ]}
                    onPress={() => setEditedResult({ ...editedResult!, color })}
                  >
                    <Text style={[styles.choiceText, editedResult?.color === color && styles.choiceTextSelected]}>
                      {color}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Texture Picker */}
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Texture</Text>
              <View style={styles.choiceGrid}>
                {textureChoices.map((texture) => (
                  <Pressable
                    key={texture}
                    style={[
                      styles.choiceButton,
                      editedResult?.texture === texture && styles.choiceButtonSelected
                    ]}
                    onPress={() => setEditedResult({ ...editedResult!, texture })}
                  >
                    <Text style={[styles.choiceText, editedResult?.texture === texture && styles.choiceTextSelected]}>
                      {texture}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Hydration Picker */}
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Hydration Level</Text>
              <View style={styles.choiceGrid}>
                {hydrationChoices.map((hydration) => (
                  <Pressable
                    key={hydration}
                    style={[
                      styles.choiceButton,
                      editedResult?.hydration_level === hydration && styles.choiceButtonSelected
                    ]}
                    onPress={() => setEditedResult({ ...editedResult!, hydration_level: hydration })}
                  >
                    <Text style={[styles.choiceText, editedResult?.hydration_level === hydration && styles.choiceTextSelected]}>
                      {hydration}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  entryDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  entryDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
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
  quickSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  notesCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
    lineHeight: 20,
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
    flexDirection: 'row',
    gap: 12,
  },
  fixButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
  },
  fixButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '90%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  headerSaveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerSaveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  modalScrollView: {
    flex: 1,
  },
  editSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceButtonSelected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  choiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  choiceTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  editedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  editedIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 6,
  },
});
