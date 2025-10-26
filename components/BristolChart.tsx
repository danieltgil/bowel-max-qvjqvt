
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BristolType {
  type: number;
  name: string;
  description: string;
  status: 'constipation' | 'ideal' | 'diarrhea';
}

const bristolTypes: BristolType[] = [
  {
    type: 1,
    name: 'Type 1',
    description: 'Separate hard lumps, like nuts',
    status: 'constipation',
  },
  {
    type: 2,
    name: 'Type 2',
    description: 'Sausage-shaped but lumpy',
    status: 'constipation',
  },
  {
    type: 3,
    name: 'Type 3',
    description: 'Like a sausage with cracks on surface',
    status: 'ideal',
  },
  {
    type: 4,
    name: 'Type 4',
    description: 'Smooth and soft, like a snake',
    status: 'ideal',
  },
  {
    type: 5,
    name: 'Type 5',
    description: 'Soft blobs with clear-cut edges',
    status: 'diarrhea',
  },
  {
    type: 6,
    name: 'Type 6',
    description: 'Fluffy pieces with ragged edges',
    status: 'diarrhea',
  },
  {
    type: 7,
    name: 'Type 7',
    description: 'Watery, no solid pieces',
    status: 'diarrhea',
  },
];

export default function BristolChart() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'constipation':
        return colors.warning;
      case 'ideal':
        return colors.success;
      case 'diarrhea':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'constipation':
        return 'Constipation';
      case 'ideal':
        return 'Ideal';
      case 'diarrhea':
        return 'Diarrhea';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bristol Stool Scale</Text>
      <Text style={styles.subtitle}>
        A medical tool to classify stool into seven types
      </Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {bristolTypes.map((item) => (
          <View key={item.type} style={styles.typeCard}>
            <View style={styles.typeHeader}>
              <Text style={styles.typeName}>{item.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.typeDescription}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  typeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  typeDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
