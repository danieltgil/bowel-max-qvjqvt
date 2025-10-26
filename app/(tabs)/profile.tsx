
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, Switch, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/app/integrations/supabase/client";
import Svg, { Path } from 'react-native-svg';

export default function ProfileScreen() {
  const { user, refreshUser, clearUser } = useUser();
  const { isDark, setTheme, theme, colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Editable fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hydrationGlasses, setHydrationGlasses] = useState("");
  const [conditionsDescription, setConditionsDescription] = useState("");

  const styles = createStyles(colors);

  const renderHeaderLeft = () => (
    <View style={styles.headerLogo}>
      <Svg width={30} height={36} viewBox="0 0 100 120" style={{ marginRight: 8 }}>
        <Path
          d="M50 110 C35 105, 22 98, 20 85 C18 75, 22 65, 30 58 C25 50, 28 42, 35 40 C30 35, 32 28, 40 25 C45 20, 50 18, 55 20 C60 18, 65 20, 70 25 C78 28, 80 35, 75 40 C82 42, 85 50, 80 58 C88 65, 92 75, 90 85 C88 98, 75 105, 60 110 C58 108, 54 110, 50 110 Z"
          fill={colors.text}
        />
      </Svg>
      <Text style={styles.headerTitle}>Bowel Max</Text>
    </View>
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAge(user.age.toString());
      setHydrationGlasses(user.hydration_glasses?.toString() || "");
      setConditionsDescription(user.conditions_description || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: name.trim(),
          age: parseInt(age),
          hydration_glasses: parseInt(hydrationGlasses),
          conditions_description: conditionsDescription.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user:', error);
        Alert.alert("Error", "Failed to update profile. Please try again.");
        return;
      }

      await refreshUser();
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setAge(user.age.toString());
      setHydrationGlasses(user.hydration_glasses?.toString() || "");
      setConditionsDescription(user.conditions_description || "");
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        <View style={styles.container}>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No user profile found</Text>
            <Text style={styles.emptySubtext}>Please complete onboarding first</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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

      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Profile Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Profile</Text>
          <Pressable onPress={() => isEditing ? handleCancel() : setIsEditing(true)}>
            <Text style={[styles.editButton, { color: colors.text }]}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </Pressable>
        </View>

        {/* Profile Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.value}>{user.name}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="Age"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.value}>{user.age} years</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Diet Type</Text>
            <Text style={styles.value}>{user.diet_type || 'Not set'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Daily Water</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={hydrationGlasses}
                onChangeText={setHydrationGlasses}
                keyboardType="number-pad"
                placeholder="Glasses"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.value}>{user.hydration_glasses || 0} glasses</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Restroom Frequency</Text>
            <Text style={styles.value}>{user.restroom_frequency || 'Not set'}</Text>
          </View>
        </View>

        {/* Health Information Card */}
        <Text style={styles.sectionTitle}>Health Information</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Gut Conditions</Text>
            <Text style={styles.value}>{user.has_conditions ? 'Yes' : 'No'}</Text>
          </View>

          {user.has_conditions && (
            <>
              <View style={styles.divider} />
              <View style={styles.columnRow}>
                <Text style={styles.label}>Description</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={conditionsDescription}
                    onChangeText={setConditionsDescription}
                    placeholder="Describe your conditions"
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                ) : (
                  <Text style={styles.descriptionValue}>
                    {user.conditions_description || 'No description'}
                  </Text>
                )}
              </View>
            </>
          )}
        </View>

        {/* Appearance Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        {/* Account Information */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>
              {new Date(user.created_at || '').toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>
        </View>

        {/* Save Button (only show when editing) */}
        {isEditing && (
          <View style={styles.saveButtonContainer}>
            <Pressable
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </Pressable>
          </View>
        )}

        <View style={styles.bottomSpacing} />
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
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: '#FAFAFA',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 0,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  columnRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'right',
  },
  descriptionValue: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    minWidth: 100,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textArea: {
    minHeight: 80,
    textAlign: 'left',
    width: '100%',
    marginTop: 8,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 20,
  },
  saveButtonContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 100,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});
