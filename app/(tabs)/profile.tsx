
import React, { useState } from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, Switch } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const [isPremium, setIsPremium] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Profile",
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
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <IconSymbol name="person.fill" color={colors.text} size={48} />
            </View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@email.com</Text>
          </View>

          {/* Premium Card */}
          <View style={[styles.premiumCard, isPremium && styles.premiumCardActive]}>
            <View style={styles.premiumHeader}>
              <View style={styles.premiumIconContainer}>
                <IconSymbol name="star.fill" color={isPremium ? colors.text : colors.warning} size={24} />
              </View>
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>
                  {isPremium ? 'Premium Member' : 'Upgrade to Premium'}
                </Text>
                <Text style={styles.premiumDescription}>
                  {isPremium 
                    ? 'Enjoy unlimited analysis and insights' 
                    : 'Get unlimited analysis, detailed insights, and more'}
                </Text>
              </View>
            </View>
            {!isPremium && (
              <Pressable style={styles.premiumButton}>
                <Text style={styles.premiumButtonText}>Upgrade Now</Text>
              </Pressable>
            )}
          </View>

          {/* Health Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            
            <Pressable style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <IconSymbol name="calendar" color={colors.textSecondary} size={20} />
                <Text style={styles.infoCardLabel}>Age</Text>
              </View>
              <View style={styles.infoCardRight}>
                <Text style={styles.infoCardValue}>32 years</Text>
                <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
              </View>
            </Pressable>

            <Pressable style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <IconSymbol name="fork.knife" color={colors.textSecondary} size={20} />
                <Text style={styles.infoCardLabel}>Diet Type</Text>
              </View>
              <View style={styles.infoCardRight}>
                <Text style={styles.infoCardValue}>Balanced</Text>
                <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
              </View>
            </Pressable>

            <Pressable style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <IconSymbol name="drop.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.infoCardLabel}>Daily Water Goal</Text>
              </View>
              <View style={styles.infoCardRight}>
                <Text style={styles.infoCardValue}>8 glasses</Text>
                <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
              </View>
            </Pressable>

            <Pressable style={styles.infoCard}>
              <View style={styles.infoCardLeft}>
                <IconSymbol name="leaf.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.infoCardLabel}>Fiber Goal</Text>
              </View>
              <View style={styles.infoCardRight}>
                <Text style={styles.infoCardValue}>25g daily</Text>
                <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
              </View>
            </Pressable>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <View style={styles.settingCard}>
              <View style={styles.settingCardLeft}>
                <IconSymbol name="bell.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.settingCardLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>

            <Pressable style={styles.settingCard}>
              <View style={styles.settingCardLeft}>
                <IconSymbol name="lock.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.settingCardLabel}>Privacy & Security</Text>
              </View>
              <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
            </Pressable>

            <Pressable style={styles.settingCard}>
              <View style={styles.settingCardLeft}>
                <IconSymbol name="questionmark.circle.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.settingCardLabel}>Help & Support</Text>
              </View>
              <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
            </Pressable>

            <Pressable style={styles.settingCard}>
              <View style={styles.settingCardLeft}>
                <IconSymbol name="doc.text.fill" color={colors.textSecondary} size={20} />
                <Text style={styles.settingCardLabel}>Terms & Conditions</Text>
              </View>
              <IconSymbol name="chevron.right" color={colors.textLight} size={16} />
            </Pressable>
          </View>

          {/* About */}
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>About Bowel Max</Text>
            <Text style={styles.aboutText}>
              Bowel Max uses AI to help you understand your digestive health. 
              All data is processed securely and privately.
            </Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
          </View>

          {/* Logout Button */}
          <Pressable style={styles.logoutButton}>
            <IconSymbol name="arrow.right.square" color={colors.error} size={20} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </Pressable>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(167, 243, 208, 0.3)',
    elevation: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  premiumCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  premiumCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  premiumButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  infoCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  infoCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 8,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  settingCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingCardLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  aboutCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  aboutVersion: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textLight,
  },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    marginLeft: 8,
  },
});
