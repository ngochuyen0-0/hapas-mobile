import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { getTabBarHeight } from '@/components/CustomTabBar';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/lib/apiClient';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeOrderStatus, setActiveOrderStatus] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const { favorites } = useFavorites();

  useEffect(() => {
    setCartCount(3);
  }, []);



  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, []),
  );

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // In a real app, you would get the token from secure storage
      // const token = await SecureStore.getItemAsync('userToken');
      // const userData = await apiClient.getProfile(token);
      
      // Load user data from storage, fallback to mock data
      const savedData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');

      const userData = savedData
        ? JSON.parse(savedData)
        : {
            name: 'Nguyễn Ngọc Huyền',
            email: 'nguyenngochuyen@example.com',
            phone: '+84 123 456 789',
            address: '123 Đường ABC, Quận XYZ, TP. HCM',
          };

      setUser(userData);
      const a = await apiClient.getOrders(
  token || "",
  savedData ? JSON.parse(savedData).id : ""
);
setOrders(a);

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
    router.push('/(tabs)/profile/edit-profile');
  };

    useEffect(() => {
    fetchProfileData();
  }, []);
  
  const handleNavigateToFavorites = () => {
    router.push('/(tabs)/profile/favorites');
  };

  const handleNavigateToCart = () => {
    router.push('/(tabs)/cart');
  };

  const handleNavigateToNotifications = () => {
    router.push('/(tabs)/profile/notifications');
  };

  const handleNavigateToOrderHistory = (status: string) => {
    router.push('/(tabs)/profile/orders');
  };

  const getOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter((order) =>
      order.status.toLowerCase().includes(status.toLowerCase()),
    );
  };

  const renderQuickAction = (
    iconName: string,
    title: string,
    count: number,
    onPress: () => void,
    color: string,
  ) => (
    <Pressable style={styles.quickActionItem} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={iconName as any} size={24} color="#fff" />
      </View>
      <ThemedText style={styles.quickActionTitle}>{title}</ThemedText>
    </Pressable>
  );

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

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Đang tải thông tin...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedText type="title" style={styles.title}>
        Hồ Sơ Của Tôi
      </ThemedText>

      {user && (
        <ThemedView style={styles.section}>
          <ThemedView style={styles.userInfoHeader}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
            <View style={styles.userInfoText}>
              <ThemedText type="subtitle" style={styles.userName}>
                {user.full_name}
              </ThemedText>
              <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
            </View>
            <Pressable style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create" size={20} color="#fff" />
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Điện Thoại:</ThemedText>
            <ThemedText>{user.phone}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.label}>Địa Chỉ:</ThemedText>
            <ThemedText>{user.address}</ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Truy Cập Nhanh
        </ThemedText>
        <View style={styles.quickActionsContainer}>
          {renderQuickAction(
            'heart',
            'Yêu Thích',
            favorites.length,
            handleNavigateToFavorites,
            '#ff6b6b',
          )}
          {renderQuickAction(
            'cart',
            'Giỏ Hàng',
            cartCount,
            handleNavigateToCart,
            '#4ecdc4',
          )}
          {renderQuickAction(
            'notifications',
            'Thông Báo',
            2,
            handleNavigateToNotifications,
            '#ffd166',
          )}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Lịch Sử Đặt Hàng
        </ThemedText>
        <View style={styles.orderStatusTabs}>
          {renderOrderStatusTab('all', 'Tất Cả')}
          {renderOrderStatusTab('pending', 'Chờ XN')}
          {renderOrderStatusTab('approved', 'Đang XL')}
          {renderOrderStatusTab('rejected', 'Đang Giao')}
          {renderOrderStatusTab('processing', 'Đã Giao')}
          {renderOrderStatusTab('đã hủy', 'Đã Hủy')}
        </View>

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
          scrollEnabled={false}
        />

        {getOrdersByStatus(activeOrderStatus).length === 0 && (
          <ThemedText style={styles.noOrdersText}>
            Không có đơn hàng nào
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Cài Đặt Tài Khoản
        </ThemedText>
        <View style={styles.settingsContainer}>
          <Pressable
            style={styles.settingsItem}
            onPress={() => router.push('/(tabs)/profile/edit-profile')}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="person" size={24} color="#000" />
            </View>
            <ThemedText style={styles.settingsText}>
              Chỉnh Sửa Thông Tin Cá Nhân
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.settingsItem}
            onPress={() => router.push('/(tabs)/profile/shipping-address')}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="location" size={24} color="#000" />
            </View>
            <ThemedText style={styles.settingsText}>
              Địa Chỉ Giao Hàng
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.settingsItem}
            onPress={() => router.push('/(tabs)/profile/payment-methods')}
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="card" size={24} color="#000" />
            </View>
            <ThemedText style={styles.settingsText}>
              Phương Thức Thanh Toán
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.settingsItem}
            onPress={() =>
              Alert.alert(
                'Trợ giúp & Hỗ trợ',
                'Hỗ trợ khách hàng 24/7. Vui lòng liên hệ qua email hoặc số điện thoại.',
              )
            }
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="help-circle" size={24} color="#000" />
            </View>
            <ThemedText style={styles.settingsText}>
              Trợ Giúp & Hỗ Trợ
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>

          <Pressable
            style={styles.settingsItem}
            onPress={() =>
              Alert.alert(
                'Trò chuyện với Hapas',
                'Hiện tại tính năng trò chuyện trực tiếp chưa khả dụng. Vui lòng liên hệ qua email hoặc số điện thoại.',
              )
            }
          >
            <View style={styles.settingsIcon}>
              <Ionicons name="chatbubbles" size={24} color="#000" />
            </View>
            <ThemedText style={styles.settingsText}>
              Trò Chuyện Cùng Hapas
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </Pressable>
        </View>
      </ThemedView>

      <Pressable
        style={[styles.logoutButton, { marginBottom: getTabBarHeight() + 20 }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInfoText: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  label: {
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    alignItems: 'center',
    width: '30%',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    fontWeight: '500',
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
    color: '#888',
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
    borderBottomColor: '#f8f8f8',
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
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
    color: '#999',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  settingsContainer: {
    flexDirection: 'column',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#ff4444',
    borderRadius: 25,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
