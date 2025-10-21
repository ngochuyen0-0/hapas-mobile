import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  Image,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { ProductReview } from '@/types/api';

export default function ReviewHistoryScreen() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch customer's reviews
        const reviewsData = await apiClient.getCustomerReviews(token);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
        Alert.alert('Lỗi', 'Không thể tải lịch sử đánh giá');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [token, user]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderReviewItem = ({ item }: { item: ProductReview }) => (
    <ThemedView style={styles.reviewItem}>
      <Image
        source={{ uri: item.product.image || (item.product.image_urls ? item.product.image_urls.split(',')[0].trim() : 'https://placehold.co/60x60') }}
        style={styles.productImage}
        onError={(e) => console.log('Image error:', e.nativeEvent.error)}
      />
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <ThemedText style={styles.productName} numberOfLines={1}>
            {item.product.name}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <ThemedText style={styles.rating}>
              {item.rating} ⭐
            </ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.reviewComment} numberOfLines={2}>
          {item.comment}
        </ThemedText>
        
        <View style={styles.reviewFooter}>
          <ThemedText style={styles.reviewDate}>
            {new Date(item.created_at).toLocaleDateString('vi-VN')}
          </ThemedText>
          <ThemedText
            style={[
              styles.reviewStatus,
              {
                color: getStatusColor(item.status),
              },
            ]}
          >
            {getStatusText(item.status)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>
          Lịch Sử Đánh Giá
        </ThemedText>
      </View>

      <ThemedView style={styles.content}>
        {loading ? (
          <ThemedText style={styles.loadingText}>Đang tải...</ThemedText>
        ) : reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={renderReviewItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Bạn chưa có đánh giá nào
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
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
  content: {
    flex: 1,
  },
  reviewItem: {
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
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#77',
    fontStyle: 'italic',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
    fontSize: 16,
  },
});