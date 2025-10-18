import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { apiClient } from '@/lib/apiClient';
import { useCart } from '@/context/CartContext';
import { getTabBarHeight } from '@/components/CustomTabBar';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getProductById(id as string);
      setProduct(data);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      // Fallback to mock data in case of error
      setProduct({
        id,
        name: 'Túi Xách Da Cổ Điển',
        price: 129.99,
        image:
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
        category: 'Túi Xách',
        description:
          'Chiếc túi xách sang trọng này được chế tạo từ chất liệu cao cấp và có ngăn chứa rộng rãi với nhiều ngăn nhỏ. Hoàn hảo cho cả dịp thường ngày và trang trọng.',
        material: 'Da Thật',
        color: 'Đen',
        size: '30 x 23 x 13 cm',
        reviews: [
          {
            id: '1',
            user: 'Nguyễn Thị A',
            rating: 5,
            comment: 'Túi rất đẹp! Chất lượng tốt.',
          },
          {
            id: '2',
            user: 'Trần Thị B',
            rating: 4,
            comment:
              'Tôi thích túi này, nhưng mong muốn có thêm nhiều ngăn hơn.',
          },
          {
            id: '3',
            user: 'Lê Thị C',
            rating: 5,
            comment: 'Kích thước hoàn hảo và rất bền.',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle image display - prefer image_urls over image
  const getProductImage = () => {
    // Check if image_urls exists and is not empty
    if (product.image_urls) {
      const urls = product.image_urls.split(',');
      const firstUrl = urls[0].trim();
      if (firstUrl) {
        return firstUrl;
      }
    }
    // Fallback to image if image_urls is not available
    if (product.image) {
      return product.image;
    }
    // Default fallback image
    return 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop';
  };

  const handleAddToCart = () => {
    if (product) {
      // Add product to cart
      addToCart({
        id: product.id,
        name: product.name,
        price:
          typeof product.price === 'number'
            ? product.price
            : parseFloat(product.price),
        quantity: 1,
        image: getProductImage(),
      });

      // Show success message
      Alert.alert(
        'Đã Thêm Vào Giỏ',
        'Sản phẩm đã được thêm vào giỏ hàng của bạn.',
      );
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text>Đang tải sản phẩm...</Text>
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Text>Không tìm thấy sản phẩm</Text>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: getProductImage() }}
        style={styles.image}
        resizeMode="cover"
      />

      <ThemedView style={styles.content}>
        <ThemedText type="title">{product.name}</ThemedText>
        <ThemedText style={styles.category}>
          {product.category?.name || product.category}
        </ThemedText>
        <ThemedText style={styles.price}>
          $
          {typeof product.price === 'number'
            ? product.price.toFixed(2)
            : product.price}
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Mô Tả</ThemedText>
          <ThemedText style={styles.description}>
            {product.description}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Chi Tiết</ThemedText>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Chất Liệu:</ThemedText>
            <ThemedText>{product.material}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Màu Sắc:</ThemedText>
            <ThemedText>{product.color}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Kích Thước:</ThemedText>
            <ThemedText>{product.size}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Đánh Giá</ThemedText>
          {product.reviews &&
            product.reviews.map((review: any) => (
              <ThemedView key={review.id} style={styles.review}>
                <ThemedView style={styles.reviewHeader}>
                  <ThemedText style={styles.reviewUser}>
                    {review.user}
                  </ThemedText>
                  <ThemedText style={styles.reviewRating}>
                    {'★'.repeat(review.rating)}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.reviewComment}>
                  {review.comment}
                </ThemedText>
              </ThemedView>
            ))}
        </ThemedView>

        <Button
          title="Thêm Vào Giỏ"
          onPress={handleAddToCart}
          style={[styles.button, { marginBottom: getTabBarHeight() + 20 }]}
        />
      </ThemedView>
    </ScrollView>
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
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  section: {
    marginTop: 20,
  },
  description: {
    marginTop: 8,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  review: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewUser: {
    fontWeight: 'bold',
  },
  reviewRating: {
    color: '#ffa500',
  },
  reviewComment: {
    marginTop: 8,
  },
  button: {
    marginTop: 20,
  },
});
