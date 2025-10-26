import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface AIInsightCardProps {
  title: string;
  emoji: string;
  items: string[];
  bulletColor?: string;
  textColor?: string;
  isConcern?: boolean;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  emoji,
  items,
  bulletColor = colors.textSecondary,
  textColor = colors.textSecondary,
  isConcern = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <View style={[styles.card, isConcern && styles.concernCard]}>
      {/* Card Header */}
      <Pressable 
        style={styles.cardHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.cardTitle}>{emoji} {title}</Text>
        <View style={styles.cardRight}>
          <Text style={styles.itemCount}>{items.length}</Text>
          <IconSymbol 
            name={isExpanded ? "chevron.up" : "chevron.down"} 
            color={colors.textSecondary} 
            size={16} 
          />
        </View>
      </Pressable>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={[styles.bullet, { backgroundColor: bulletColor }]} />
                <Text style={[styles.itemText, { color: textColor }]}>{item}</Text>
              </View>
            ))}
          </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  concernCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
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
  cardRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  itemCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600' as const,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    flexShrink: 0,
  },
  itemText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    fontWeight: '500' as const,
  },
};

export default AIInsightCard;
