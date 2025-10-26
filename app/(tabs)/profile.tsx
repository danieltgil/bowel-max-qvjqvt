
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, Switch, TextInput, Alert, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/app/integrations/supabase/client";

export default function ProfileScreen() {
  const { user, refreshUser, clearUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Editable fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [hydrationGlasses, setHydrationGlasses] = useState("");
  const [conditionsDescription, setConditionsDescription] = useState("");

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
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Profile",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No user profile found</Text>
          <Text style={styles.emptySubtext}>Please complete onboarding first</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable onPress={() => isEditing ? handleCancel() : setIsEditing(true)}>
              <Text style={styles.headerButton}>
                {isEditing ? "Cancel" : "Edit"}
              </Text>
            </Pressable>
          ),
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={styles.name}>{user.name}</Text>
          )}
          <Text style={styles.memberSince}>
            Member since {new Date(user.created_at || '').toLocaleDateString()}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <IconSymbol name="calendar" color={colors.primary} size={20} />
                <Text style={styles.infoLabelText}>Age</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="Age"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.infoValue}>{user.age} years</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <IconSymbol name="leaf.fill" color={colors.success} size={20} />
                <Text style={styles.infoLabelText}>Diet Type</Text>
              </View>
              <Text style={styles.infoValue}>{user.diet_type || 'Not set'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <IconSymbol name="drop.fill" color={colors.info} size={20} />
                <Text style={styles.infoLabelText}>Daily Water</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={hydrationGlasses}
                  onChangeText={setHydrationGlasses}
                  keyboardType="number-pad"
                  placeholder="Glasses"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                <Text style={styles.infoValue}>{user.hydration_glasses || 0} glasses</Text>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <IconSymbol name="clock.fill" color={colors.warning} size={20} />
                <Text style={styles.infoLabelText}>Frequency</Text>
              </View>
              <Text style={styles.infoValue}>{user.restroom_frequency || 'Not set'}/day</Text>
            </View>
          </View>
        </View>

        {/* Health Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <IconSymbol name="heart.fill" color={colors.error} size={20} />
                <Text style={styles.infoLabelText}>Gut Conditions</Text>
              </View>
              <Text style={styles.infoValue}>{user.has_conditions ? 'Yes' : 'No'}</Text>
            </View>

            {user.has_conditions && (
              <>
                <View style={styles.divider} />
                <View style={styles.conditionsContainer}>
                  {isEditing ? (
                    <TextInput
                      style={[styles.infoInput, styles.textArea]}
                      value={conditionsDescription}
                      onChangeText={setConditionsDescription}
                      placeholder="Describe your conditions"
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  ) : (
                    <Text style={styles.conditionsText}>
                      {user.conditions_description || 'No description provided'}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <Pressable 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        )}

        {/* Settings Section */}
        {!isEditing && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.infoCard}>
              <Pressable style={styles.settingRow}>
                <View style={styles.infoLabel}>
                  <IconSymbol name="bell.fill" color={colors.primary} size={20} />
                  <Text style={styles.infoLabelText}>Notifications</Text>
                </View>
                <Switch
                  value={true}
                  onValueChange={() => console.log('Toggle notifications')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </Pressable>

              <View style={styles.divider} />

              <Pressable style={styles.settingRow}>
                <View style={styles.infoLabel}>
                  <IconSymbol name="moon.fill" color={colors.textSecondary} size={20} />
                  <Text style={styles.infoLabelText}>Dark Mode</Text>
                </View>
                <Switch
                  value={false}
                  onValueChange={() => console.log('Toggle dark mode')}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.background}
                />
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
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
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    textAlign: 'center',
    minWidth: 200,
  },
  memberSince: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
    textAlign: 'right',
  },
  textArea: {
    minHeight: 80,
    textAlign: 'left',
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  conditionsContainer: {
    paddingTop: 12,
  },
  conditionsText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  bottomSpacing: {
    height: 40,
  },
});
