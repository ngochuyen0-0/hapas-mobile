import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
 Text,
  ActivityIndicator,
  Platform,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ProductCard } from '@/components/ProductCard';
import ThreeFrameBanner from '@/components/ThreeFrameBanner';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';
import { apiClient } from '@/lib/apiClient';
import { getTabBarHeight } from '@/components/CustomTabBar';
import { Product, Category } from '@/types/api';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock slider data - in a real app, this would come from an API
  const sliderData = [
    {
      id: '1',
      image:
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&h=400&fit=crop&q=85',
      title: 'Bộ sưu tập mới',
    },
    {
      id: '2',
      image:
        'https://images.unsplash.com/photo-1563107725-66a28043325b?w=1000&h=400&fit=crop&q=85',
      title: 'Ưu đãi đặc biệt',
    },
    {
      id: '3',
      image:
        'https://images.unsplash.com/photo-1599058917765-a780eda07f3b?w=1000&h=400&fit=crop&q=85',
      title: 'Sản phẩm nổi bật',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Đang tải dữ liệu sản phẩm...');
      
      const [productsData, categoriesData] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
      ]);
      
      console.log(`✅ Đã tải ${productsData.length} sản phẩm và ${categoriesData.length} danh mục`);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu:', error);
      setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.');
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
      setFilteredProducts(products); // Initialize filtered products with all products
    }
  };

  // Update the initial filtered products when products are loaded
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const retryFetch = () => {
    fetchData();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      setIsSearching(true);
      try {
        const searchResults = await apiClient.searchProducts(query);
        setFilteredProducts(searchResults);
      } catch (error) {
        console.error('Error searching products:', error);
        // Fallback to client-side search if API fails
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        );
        setFilteredProducts(filtered);
      } finally {
        setIsSearching(false);
      }
    }
 };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.loadingText}>Đang tải dữ liệu...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <ThemedText style={styles.retryButton} onPress={retryFetch}>
          Thử lại
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        refreshing={refreshing || isSearching}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View>
            {/* Welcome message */}
            <ThemedView style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Chào Mừng Đến Hapas
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Khám Phá Bộ Sưu Tập Của Chúng Tôi
              </ThemedText>
            </ThemedView>

            {/* Search Bar */}
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />

            {/* Slider */}
            <ThreeFrameBanner banners={sliderData} />

            {/* Categories */}
            <ThemedView style={styles.section}>
              <ThemedText type="title" style={styles.sectionTitle}>
                Danh Mục
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onPress={(category) => {
                      // Navigate to category screen with category ID
                      const categoryId = category.id;
                      router.push({
                        pathname: '/(tabs)/category/[id]',
                        params: { id: categoryId },
                      });
                    }}
                  />
                ))}
              </ScrollView>
            </ThemedView>

            {/* Products Title */}
            <ThemedView style={styles.section}>
              <ThemedText type="title" style={styles.sectionTitle}>
                {searchQuery
                  ? `Kết quả tìm kiếm cho: "${searchQuery}"`
                  : 'Sản Phẩm'}
              </ThemedText>
            </ThemedView>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: getTabBarHeight() + 20 },
        ]}
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
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    paddingHorizontal: 15,
    marginBottom: 10,
    marginLeft: 5,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 8,
    paddingHorizontal: 2,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  retryButton: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
