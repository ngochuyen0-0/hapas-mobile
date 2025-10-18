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

export default function OrderHistoryScreen() {
  const { status } = useLocalSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrderStatus, setActiveOrderStatus] = useState<string>(
    (status as string) || 'all',
  );

  useEffect(() => {
    // Mock data for orders
    setOrders([
      { id: 'ORD-01', date: '2023-06-15', total: 129000, status: 'Đã Giao' },
      { id: 'ORD-002', date: '2023-06-10', total: 89000, status: 'Đã Giao' },
      {
        id: 'ORD-003',
        date: '2023-06-05',
        total: 199000,
        status: 'Đang Xử Lý',
      },
      {
        id: 'ORD-004',
        date: '2023-06-01',
        total: 75000,
        status: 'Chờ Xác Nhận',
      },
      { id: 'ORD-005', date: '2023-05-28', total: 210000, status: 'Đang Giao' },
      { id: 'ORD-006', date: '2023-05-20', total: 85000, status: 'Đã Hủy' },
    ]);
  }, []);

  const getOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) =>
      order.status.toLowerCase().includes(status.toLowerCase()),
    );
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
        <FlatList
          data={getOrdersByStatus(activeOrderStatus)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.orderRow}
              onPress={() =>
                Alert.alert('Chi tiết đơn hàng', `Mã đơn hàng: ${item.id}`)
              }
            >
              <ThemedView>
                <ThemedText type="defaultSemiBold">{item.id}</ThemedText>
                <ThemedText style={styles.orderDate}>{item.date}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.orderRight}>
                <ThemedText>
                  {typeof item.total === 'number'
                    ? item.total.toLocaleString('vi-VN') + '₫'
                    : item.total}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.orderStatus,
                    {
                      color: item.status.includes('Giao')
                        ? '#4CAF50'
                        : item.status.includes('Xác Nhận')
                          ? '#FF9800'
                          : item.status.includes('Xử Lý')
                            ? '#2196F3'
                            : item.status.includes('Hủy')
                              ? '#F44336'
                              : '#9E9E9E',
                    },
                  ]}
                >
                  {item.status}
                </ThemedText>
              </ThemedView>
            </Pressable>
          )}
        />

        {getOrdersByStatus(activeOrderStatus).length === 0 && (
          <ThemedText style={styles.noOrdersText}>
            Không có đơn hàng nào
          </ThemedText>
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
  noOrdersText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 20,
  },
});
