import { StyleSheet, View, Text, Pressable, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { getTabBarHeight } from '@/components/CustomTabBar';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the token from secure storage
      // const token = await SecureStore.getItemAsync('userToken');
      // const userData = await apiClient.getProfile(token);
      // const ordersData = await apiClient.getOrders(token);
      
      // Mock data for now until we implement authentication
      setUser({
        name: 'Nguyễn Ngọc Huyền',
        email: 'nguyenngochuyen@example.com',
        phone: '+84 123 456 789',
        address: '123 Đường ABC, Quận XYZ, TP. HCM',
      });
      
      setOrders([
        { id: 'ORD-001', date: '2023-06-15', total: 129.99, status: 'Đã Giao' },
        { id: 'ORD-002', date: '2023-06-10', total: 89.99, status: 'Đã Giao' },
        { id: 'ORD-003', date: '2023-06-05', total: 199.99, status: 'Đang Xử Lý' },
      ]);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // In a real app, you would clear the user session
    // await SecureStore.deleteItemAsync('userToken');
    router.push('/login');
  };

  const handleEditProfile = () => {
    Alert.alert('Chức năng đang được phát triển', 'Chức năng chỉnh sửa profile sẽ được cập nhật trong phiên bản tiếp theo.');
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Đang tải thông tin...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Hồ Sơ Của Tôi</ThemedText>
      
      {user && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Thông Tin Cá Nhân</ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Tên:</ThemedText>
            <ThemedText>{user.name}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Email:</ThemedText>
            <ThemedText>{user.email}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Điện Thoại:</ThemedText>
            <ThemedText>{user.phone}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Địa Chỉ:</ThemedText>
            <ThemedText>{user.address}</ThemedText>
          </ThemedView>
          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Chỉnh Sửa Hồ Sơ</Text>
          </Pressable>
        </ThemedView>
      )}
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Lịch Sử Đặt Hàng</ThemedText>
        {orders.map(order => (
          <ThemedView key={order.id} style={styles.orderRow}>
            <ThemedView>
              <ThemedText type="defaultSemiBold">{order.id}</ThemedText>
              <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.orderRight}>
              <ThemedText>${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}</ThemedText>
              <ThemedText style={styles.orderStatus}>{order.status}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
      
      <Pressable style={[styles.logoutButton, { marginBottom: getTabBarHeight() + 20 }]} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 80,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#ff4444',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});