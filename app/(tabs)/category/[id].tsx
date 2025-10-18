import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProductCard } from '@/components/ProductCard';
import { apiClient } from '@/lib/apiClient';
import { Product } from '@/types/api';
import { useLocalSearchParams } from 'expo-router';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductsByCategory();
    }
  }, [id]);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getProductsByCategory(id);
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.loadingText}>Đang tải sản phẩm...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="default">{error}</ThemedText>
        <Text style={styles.retryButton} onPress={fetchProductsByCategory}>
          Thử lại
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Sản phẩm theo danh mục
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <ThemedText type="default">
              Không có sản phẩm nào trong danh mục này.
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  listContent: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  retryButton: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});
