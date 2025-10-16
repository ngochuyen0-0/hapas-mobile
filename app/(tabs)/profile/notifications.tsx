import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // Mock data for notifications
    setNotifications([
      { 
        id: '1', 
        title: 'Đơn hàng đã được xác nhận', 
        message: 'Đơn hàng #ORD-001 của bạn đã được xác nhận và đang được xử lý',
        date: '2023-06-15',
        read: false
      },
      { 
        id: '2', 
        title: 'Ưu đãi đặc biệt', 
        message: 'Giảm 20% cho đơn hàng tiếp theo của bạn', 
        date: '2023-06-14',
        read: true
      },
      { 
        id: '3', 
        title: 'Sản phẩm mới', 
        message: 'Sản phẩm bạn yêu thích vừa được cập nhật phiên bản mới', 
        date: '2023-06-12',
        read: false
      },
      { 
        id: '4', 
        title: 'Giao hàng thành công', 
        message: 'Đơn hàng #ORD-002 đã được giao thành công', 
        date: '2023-06-10',
        read: true
      },
    ]);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <Pressable 
      style={[styles.notificationItem, !item.read && styles.unreadNotification]} 
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <ThemedText style={[styles.notificationTitle, !item.read && styles.unreadText]}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.notificationMessage}>{item.message}</ThemedText>
        <ThemedText style={styles.notificationDate}>{item.date}</ThemedText>
      </View>
      {!item.read && <View style={styles.unreadIndicator} />}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Thông Báo</ThemedText>
      </View>
      
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Bạn chưa có thông báo nào</ThemedText>
        </ThemedView>
      )}
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
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
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
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  unreadText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#999',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200ee',
    marginLeft: 10,
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