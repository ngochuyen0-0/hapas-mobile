import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

interface Category {
 id: string;
 name: string;
 image?: string; // Optional image URL
}

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

// Function to get a vibrant color based on category name
const getCategoryColor = (categoryName: string): string => {
 const colors = [
    '#FF6B6B', // Vibrant Red
    '#4ECDC4', // Vibrant Teal
    '#45B7D1', // Vibrant Blue
    '#96CEB4', // Vibrant Green
    '#FFEAA7', // Vibrant Yellow
    '#DDA0DD', // Vibrant Plum
    '#98D8C8', // Vibrant Mint
    '#F7DC6F', // Vibrant Light Yellow
    '#BB8FCE', // Vibrant Light Purple
    '#85C1E9', // Vibrant Light Blue
    '#F8C4C4', // Light Pink
    '#D4E6F1', // Light Sky Blue
    '#D5F5E3', // Light Mint
    '#FCF3CF', // Light Beige
    '#FADBD8', // Light Rose
  ];
  
  // Simple hash function to get consistent color for each category
  let hash = 0;
 for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const backgroundColor = getCategoryColor(category.name);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(category)}
    >
      <View style={styles.categoryFrame}>
        <View style={[styles.categoryCircle, { backgroundColor: backgroundColor }]}>
          {category.image ? (
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
          ) : (
            <Text style={styles.categoryInitial}>
              {category.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 8,
  },
  categoryFrame: {
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
 categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  categoryInitial: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#55',
    textAlign: 'center',
    maxWidth: 90,
  },
});

export default CategoryCard;
