import { StyleSheet, View, Text, FlatList, Pressable, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFavorites } from '@/context/FavoritesContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    Alert.alert('Đã xóa', 'Sản phẩm đã được xóa khỏi danh sách yêu thích');
  };

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.favoriteItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.productName}>{item.name}</ThemedText>
        <ThemedText style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}₫</ThemedText>
        {item.rating && (
          <View style={styles.ratingContainer}>
            <ThemedText style={styles.rating}>{item.rating} ⭐</ThemedText>
          </View>
        )}
      </View>
      <Pressable style={styles.removeButton} onPress={() => handleRemoveFavorite(item.id)}>
        <ThemedText style={styles.removeButtonText}>X</ThemedText>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Sản Phẩm Yêu Thích</ThemedText>
      </View>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Bạn chưa có sản phẩm yêu thích nào</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9',
 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
 },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
});