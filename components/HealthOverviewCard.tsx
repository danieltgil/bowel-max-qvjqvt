import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface HealthOverviewCardProps {
  summary: string;
}

const HealthOverviewCard: React.FC<HealthOverviewCardProps> = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!summary) return null;

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <Pressable 
        style={styles.cardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>📊 Health Overview</Text>
        <IconSymbol 
          name={isExpanded ? "chevron.up" : "chevron.down"} 
          color={colors.textSecondary} 
          size={16} 
        />
      </Pressable>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.fullText}>{summary}</Text>
        </View>
      )}
    </View>
  );
};

const styles = {
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    flex: 1,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fullText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
};

export default HealthOverviewCard;
