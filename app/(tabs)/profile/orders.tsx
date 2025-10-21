import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { Order } from '@/types/api';

export default function OrderHistoryScreen() {
  const { status } = useLocalSearchParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderStatus, setActiveOrderStatus] = useState<string>(
    (status as string) || 'all',
  );

  useEffect(() => {
    const loadOrders = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersData = await apiClient.getOrders(token);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
        Alert.alert('Lỗi', 'Không thể tải lịch sử đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, user]);

  const getOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) => {
      const orderStatus = order.status.toLowerCase();
      switch (status) {
        case 'chờ xác nhận':
          return orderStatus === 'pending';
        case 'đang xử lý':
          return orderStatus === 'processing';
        case 'đang giao':
          return orderStatus === 'shipped';
        case 'đã giao':
          return orderStatus === 'delivered';
        case 'đã hủy':
          return orderStatus === 'cancelled';
        default:
          return false;
      }
    });
  };

  const renderOrderStatusTab = (status: string, title: string) => (
    <Pressable
      style={[
        styles.orderStatusTab,
        activeOrderStatus === status && styles.activeOrderStatusTab,
      ]}
      onPress={() => setActiveOrderStatus(status)}
    >
      <ThemedText
        style={[
          styles.orderStatusText,
          activeOrderStatus === status && styles.activeOrderStatusText,
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
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
          Lịch Sử Đơn Hàng
        </ThemedText>
      </View>

      {/* Order Status Tabs */}
      <ThemedView style={styles.section}>
        <View style={styles.orderStatusTabs}>
          {renderOrderStatusTab('all', 'Tất Cả')}
          {renderOrderStatusTab('chờ xác nhận', 'Chờ XN')}
          {renderOrderStatusTab('đang xử lý', 'Đang XL')}
          {renderOrderStatusTab('đang giao', 'Đang Giao')}
          {renderOrderStatusTab('đã giao', 'Đã Giao')}
          {renderOrderStatusTab('đã hủy', 'Đã Hủy')}
        </View>
      </ThemedView>

      {/* Orders List */}
      <ThemedView style={styles.section}>
        {loading ? (
          <ThemedText style={styles.loadingText}>Đang tải...</ThemedText>
        ) : (
          <>
            <FlatList
              data={getOrdersByStatus(activeOrderStatus)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const getStatusText = (status: string) => {
                  switch (status) {
                    case 'pending':
                      return 'Chờ Xác Nhận';
                    case 'processing':
                      return 'Đang Xử Lý';
                    case 'shipped':
                      return 'Đang Giao';
                    case 'delivered':
                      return 'Đã Giao';
                    case 'cancelled':
                      return 'Đã Hủy';
                    default:
                      return status;
                  }
                };

                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'delivered':
                      return '#4CAF50';
                    case 'pending':
                      return '#FF9800';
                    case 'processing':
                      return '#2196F3';
                    case 'shipped':
                      return '#9C27B0';
                    case 'cancelled':
                      return '#F44336';
                    default:
                      return '#9E9E9E';
                  }
                };

                return (
                  <Pressable
                    style={styles.orderRow}
                    onPress={() =>
                      Alert.alert(
                        'Chi tiết đơn hàng',
                        `Mã đơn hàng: ${item.id}\nTổng tiền: ${item.total_amount.toLocaleString('vi-VN')}₫\nTrạng thái: ${getStatusText(item.status)}${item.payment ? `\nPhương thức: ${item.payment.payment_method}` : ''}`
                      )
                    }
                  >
                    <ThemedView>
                      <ThemedText type="defaultSemiBold">{item.id}</ThemedText>
                      <ThemedText style={styles.orderDate}>
                        {new Date(item.order_date).toLocaleDateString('vi-VN')}
                      </ThemedText>
                      {item.payment && (
                        <ThemedText style={styles.paymentMethod}>
                          {item.payment.payment_method}
                        </ThemedText>
                      )}
                    </ThemedView>
                    <ThemedView style={styles.orderRight}>
                      <ThemedText>
                        {item.total_amount.toLocaleString('vi-VN')}₫
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.orderStatus,
                          {
                            color: getStatusColor(item.status),
                          },
                        ]}
                      >
                        {getStatusText(item.status)}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                );
              }}
            />

            {getOrdersByStatus(activeOrderStatus).length === 0 && (
              <ThemedText style={styles.noOrdersText}>
                Không có đơn hàng nào
              </ThemedText>
            )}
          </>
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  orderStatusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 4,
  },
  orderStatusTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeOrderStatusTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderStatusText: {
    fontSize: 12,
    color: '#88',
  },
  activeOrderStatusText: {
    color: '#6200ee',
    fontWeight: '600',
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderStatus: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  paymentMethod: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  noOrdersText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
    fontSize: 16,
  },
});
