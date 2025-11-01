import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ContinueButton } from '@/components/onboarding/ContinueButton';
import * as Haptics from 'expo-haptics';

export default function PlanSelectionScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleContinue = () => {
    // Navigate to home screen after completing onboarding
    router.replace('/(tabs)/(home)/' as any);
  };

  const handlePlanSelect = (plan: 'monthly' | 'yearly') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlan(plan);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badge}>LIMITED TIME OFFER</Text>
        <Text style={styles.title}>Start your FREE trial</Text>
        <Text style={styles.subtitle}>
          7 days free, then continue with your preferred plan
        </Text>
      </View>

      {/* Plan Cards */}
      <View style={styles.plansContainer}>
        {/* Yearly Plan - Recommended */}
        <Pressable
          style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
          onPress={() => handlePlanSelect('yearly')}
        >
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>BEST VALUE</Text>
          </View>

          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planName, selectedPlan === 'yearly' && styles.planNameSelected]}>
                Yearly
              </Text>
              <Text style={[styles.planPrice, selectedPlan === 'yearly' && styles.planPriceSelected]}>
                $49.99/year
              </Text>
            </View>
            <View style={[styles.radioOuter, selectedPlan === 'yearly' && styles.radioOuterSelected]}>
              {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
            </View>
          </View>

          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>Save 58% • Just $4.16/month</Text>
          </View>

          <View style={styles.freeBadgeContainer}>
            <Text style={styles.freeBadgeText}>🎉 7 DAYS FREE</Text>
          </View>
        </Pressable>

        {/* Monthly Plan */}
        <Pressable
          style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
          onPress={() => handlePlanSelect('monthly')}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={[styles.planName, selectedPlan === 'monthly' && styles.planNameSelected]}>
                Monthly
              </Text>
              <Text style={[styles.planPrice, selectedPlan === 'monthly' && styles.planPriceSelected]}>
                $9.99/month
              </Text>
            </View>
            <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioOuterSelected]}>
              {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
            </View>
          </View>

          <View style={styles.freeBadgeContainer}>
            <Text style={styles.freeBadgeText}>🎉 7 DAYS FREE</Text>
          </View>
        </Pressable>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Everything included:</Text>
        <View style={styles.featureItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Unlimited tracking</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>AI-powered insights</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Personalized recommendations</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Apple Health integration</Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <View style={styles.freeTrialBanner}>
          <Text style={styles.freeTrialText}>
            ⚡ NO PAYMENT DUE TODAY ⚡
          </Text>
        </View>

        <ContinueButton label="Start FREE Trial" onPress={handleContinue} />

        <Text style={styles.disclaimer}>
          Free for 7 days, then {selectedPlan === 'yearly' ? '$49.99/year' : '$9.99/month'}.
          Cancel anytime.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 16,
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },
  planCardSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  planNameSelected: {
    color: '#FFFFFF',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
  },
  planPriceSelected: {
    color: '#D1D5DB',
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FFFFFF',
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  savingsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  freeBadgeContainer: {
    marginTop: 8,
  },
  freeBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  featuresContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#22C55E',
    fontWeight: '700',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#4B5563',
  },
  ctaContainer: {
    gap: 16,
  },
  freeTrialBanner: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  freeTrialText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 1,
  },
  disclaimer: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
