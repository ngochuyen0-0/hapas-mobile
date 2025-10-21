import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { apiClient } from '@/lib/apiClient';
import { useCart } from '@/context/CartContext';
import { getTabBarHeight } from '@/components/CustomTabBar';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      // Animation when product loads
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [product]);

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

  const handleBuyNow = () => {
    if (product) {
      // Add product to cart first
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

      // Navigate to checkout
      router.push('/(tabs)/checkout');
    }
 };

  const handleRatingPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const submitReview = async () => {
    if (!reviewText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your backend
      // For now, we'll just add it to the local state as a mock submission
      const newReview = {
        id: Date.now().toString(),
        user: 'Bạn', // In a real app, this would come from the logged-in user
        rating: rating,
        comment: reviewText,
        date: new Date().toISOString(),
      };

      // Update the product with the new review
      setProduct((prev: any) => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])]
      }));

      // Reset the form
      setReviewText('');
      setRating(5);
      setShowReviewForm(false);

      Alert.alert('Thành công', 'Đánh giá của bạn đã được gửi');
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
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
      {/* Product Image with rounded corners and shadow */}
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={{ uri: getProductImage() }}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Product Title */}
        <ThemedText style={styles.title}>{product.name}</ThemedText>
        
        {/* Category with badge style */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>
              {product.category?.name || product.category}
            </ThemedText>
          </View>
        </View>
        
        {/* Price with feminine styling */}
        <ThemedText style={styles.price}>
          {typeof product.price === 'number'
            ? product.price.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).replace(/,/g, '.') + ' đ'
            : product.price.toString().replace(/,/g, '.') + ' đ'}
        </ThemedText>
        
        {/* Availability indicator */}
        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityDot} />
          <ThemedText style={styles.availabilityText}>Còn hàng</ThemedText>
        </View>

        {/* Description section */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color="#ff69b4" />
            <ThemedText style={styles.sectionTitle}>Mô Tả</ThemedText>
          </View>
          <ThemedText style={styles.description}>
            {product.description}
          </ThemedText>
        </ThemedView>

        {/* Details section */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#ff69b4" />
            <ThemedText style={styles.sectionTitle}>Chi Tiết</ThemedText>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="cube-outline" size={16} color="#ff69b4" />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Chất Liệu</ThemedText>
                <ThemedText style={styles.detailValue}>{product.material}</ThemedText>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="color-palette-outline" size={16} color="#ff69b4" />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Màu Sắc</ThemedText>
                <ThemedText style={styles.detailValue}>{product.color}</ThemedText>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="resize-outline" size={16} color="#ff69b4" />
              </View>
              <View style={styles.detailContent}>
                <ThemedText style={styles.detailLabel}>Kích Thước</ThemedText>
                <ThemedText style={styles.detailValue}>{product.size}</ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Reviews section */}
        <ThemedView style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star-outline" size={20} color="#ff69b4" />
            <ThemedText style={styles.sectionTitle}>Đánh Giá</ThemedText>
          </View>
          
          {/* Write Review Button */}
          <Pressable
            style={styles.writeReviewButton}
            onPress={() => setShowReviewForm(!showReviewForm)}
          >
            <Ionicons name="pencil-outline" size={18} color="#fff" />
            <ThemedText style={styles.writeReviewText}>Viết Đánh Giá</ThemedText>
          </Pressable>
          
          {/* Review Form */}
          {showReviewForm && (
            <View style={styles.reviewFormContainer}>
              <View style={styles.ratingContainer}>
                <ThemedText style={styles.ratingLabel}>Đánh giá của bạn:</ThemedText>
                <View style={styles.starsContainer}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleRatingPress(index)}
                    >
                      <Ionicons
                        name={index < rating ? "star" : "star-outline"}
                        size={30}
                        color={index < rating ? "#ff69b4" : "#ddd"}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
              
              <View style={styles.reviewInputContainer}>
                <ThemedText style={styles.reviewInputLabel}>Nội dung đánh giá</ThemedText>
                <TextInput
                  style={styles.reviewTextInput}
                  multiline
                  numberOfLines={4}
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  placeholderTextColor="#aaa"
                />
              </View>
              
              <View style={styles.reviewButtonContainer}>
                <Button
                  title="Gửi Đánh Giá"
                  onPress={submitReview}
                  disabled={isSubmitting}
                  style={styles.submitReviewButton}
                />
                <Button
                  title="Hủy"
                  onPress={() => {
                    setShowReviewForm(false);
                    setReviewText('');
                    setRating(5);
                  }}
                  style={styles.cancelReviewButton}
                />
              </View>
            </View>
          )}
          
          <View style={styles.reviewsContainer}>
            {product.reviews &&
              product.reviews.map((review: any) => (
                <View key={review.id} style={styles.review}>
                  <View style={styles.reviewHeader}>
                    <ThemedText style={styles.reviewUser}>
                      {review.user}
                    </ThemedText>
                    <View style={styles.starsContainer}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Ionicons
                          key={index}
                          name={index < review.rating ? "star" : "star-outline"}
                          size={16}
                          color={index < review.rating ? "#ff69b4" : "#ddd"}
                        />
                      ))}
                    </View>
                  </View>
                  <ThemedText style={styles.reviewComment}>
                    {review.comment}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>

        {/* Buttons Container */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Mua Ngay"
            onPress={handleBuyNow}
            style={[styles.buyNowButton, { flex: 1, marginRight: 10 }]}
          />
          <Button
            title="Thêm Vào Giỏ"
            onPress={handleAddToCart}
            style={[styles.addToCartButton, { flex: 1, marginLeft: 10 }]}
          />
        </View>
        <View style={{ marginBottom: getTabBarHeight() + 20 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5', // Light pink background
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#f9d4d8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Black color
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'System',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: '#fdf2f3', // Very light pink background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f9d4d8',
  },
  categoryText: {
    fontSize: 14,
    color: '#000000', // Black color
    fontWeight: '600',
  },
   price: {
     fontSize: 28,
     fontWeight: 'bold',
     color: '#000000', // Black color
     textAlign: 'left',
     marginBottom: 5,
     fontFamily: 'System',
   },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000', // Black color
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000', // Black color
    backgroundColor: '#fff0f5', // Light pink background
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffb6c1', // Light pink border
  },
  detailsContainer: {
    backgroundColor: '#fff0f5', // Light pink background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffb6c1', // Light pink border
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9d4d8',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailIcon: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000', // Black color
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#000000', // Black color
 },
  reviewsContainer: {
    backgroundColor: '#fff0f5', // Light pink background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffb6c1', // Light pink border
    padding: 15,
  },
  review: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9d4d8',
  },
  reviewLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewUser: {
    fontWeight: '600',
    color: '#000000', // Black color
  },
  starsContainer: {
    flexDirection: 'row',
 },
  reviewComment: {
    fontSize: 15,
    color: '#000000', // Black color
    lineHeight: 18,
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: '#f9c4ca', // Very light pink button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: '#f9c4ca',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9c4ca',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  writeReviewText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewFormContainer: {
    backgroundColor: '#fff0f5', // Light pink background
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ffb6c1', // Light pink border
    marginBottom: 15,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000', // Black color
    marginBottom: 10,
  },
  reviewInputContainer: {
    marginBottom: 15,
  },
  reviewInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000', // Black color
    marginBottom: 8,
  },
  reviewTextInput: {
    borderWidth: 1,
    borderColor: '#ffb6c1', // Light pink border
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  reviewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitReviewButton: {
    flex: 0.48,
    backgroundColor: '#f9c4ca',
  },
  cancelReviewButton: {
    flex: 0.48,
    backgroundColor: '#dcdcdc',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
 buyNowButton: {
   backgroundColor: '#f9c4ca', // Light pink to match theme
   borderRadius: 25,
   paddingVertical: 15,
   paddingHorizontal: 20,
   shadowColor: '#f9c4ca',
   shadowOffset: {
     width: 0,
     height: 4,
   },
   shadowOpacity: 0.3,
   shadowRadius: 6,
   elevation: 8,
},
 availabilityContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'flex-start',
   marginBottom: 15,
 },
 availabilityDot: {
   width: 10,
   height: 10,
   borderRadius: 5,
   backgroundColor: '#4CAF50', // Green color for available
   marginRight: 8,
 },
 availabilityText: {
   fontSize: 16,
   color: '#000000', // Black color
   fontWeight: '600',
 },
});
