import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
}

export function FavoriteButton({ 
  isFavorite, 
  onPress, 
  size = 24,
  color = '#ff4757'
}: FavoriteButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons 
        name={isFavorite ? 'heart' : 'heart-outline'} 
        size={size} 
        color={isFavorite ? color : '#ccc'} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 5,
  },
});