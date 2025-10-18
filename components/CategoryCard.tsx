import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Category } from '@/types/api';

interface CategoryCardProps {
  category: Category | string;
  onPress: (category: Category | string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
}) => {
  // Handle both Category object and string types
  const categoryName = typeof category === 'string' ? category : category.name;
  const categoryId = typeof category === 'string' ? category : category.id;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(category)}
    >
      <View style={styles.card}>
        {/* Placeholder for category image */}
        <View style={styles.imagePlaceholder}>
          <ThemedText type="defaultSemiBold">
            {categoryName.charAt(0)}
          </ThemedText>
        </View>
        <ThemedText style={styles.categoryName} numberOfLines={1}>
          {categoryName}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 4,
  },
  card: {
    alignItems: 'center',
    width: 80,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
    fontSize: 12,
  },
});
