import { StyleSheet, View, Text, Pressable, TextInput, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { apiClient } from '@/lib/apiClient';
import { getTabBarHeight } from '@/components/CustomTabBar';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen() {
  const router = useRouter();
  const { state: cartState, clearCart } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Việt Nam',
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin vận chuyển');
      return;
    }

    // Check if user is logged in
    if (!token) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập để đặt hàng');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare order data with correct structure
      const orderData = {
        items: cartState.items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price, // Changed from 'price' to 'unit_price'
        })),
        shipping_address: `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
        total_amount: cartState.total + 9.99 + (cartState.total * 0.08),
        payment_method: paymentMethod,
      };

      // Create order
      const response = await apiClient.createOrder(token || '', orderData);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation with order data
      router.push({
        pathname: '/order-confirmation',
        params: {
          orderId: response.order?.id || 'ORD-' + Date.now(),
          orderDate: new Date().toLocaleDateString('vi-VN'),
          totalAmount: orderData.total_amount.toFixed(2),
          paymentMethod: paymentMethod,
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartState.total;
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <ThemedText type="title" style={styles.title}>Thanh Toán</ThemedText>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Thông Tin Vận Chuyển</ThemedText>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Họ Và Tên</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            placeholder="Nhập họ và tên"
          />
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Địa Chỉ</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Nhập địa chỉ"
          />
        </ThemedView>
        
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.inputGroup, styles.flexOne]}>
            <ThemedText style={styles.label}>Thành Phố</ThemedText>
            <TextInput
              style={styles.input}
              value={shippingInfo.city}
              onChangeText={(value) => handleInputChange('city', value)}
              placeholder="Nhập thành phố"
            />
          </ThemedView>
          
          <ThemedView style={[styles.inputGroup, styles.flexOne, styles.marginLeft]}>
            <ThemedText style={styles.label}>Mã ZIP</ThemedText>
            <TextInput
              style={styles.input}
              value={shippingInfo.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="Nhập mã ZIP"
              keyboardType="numeric"
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Quốc Gia</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.country}
            onChangeText={(value) => handleInputChange('country', value)}
            placeholder="Nhập quốc gia"
          />
        </ThemedView>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Phương Thức Thanh Toán</ThemedText>
        <ThemedView style={styles.paymentOptions}>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('cod')}
          >
            <ThemedText style={styles.paymentOptionText}>Thanh Toán Khi Nhận Hàng (COD)</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'bank' && styles.selectedPaymentOption]}
            onPress={() => setPaymentMethod('bank')}
          >
            <ThemedText style={styles.paymentOptionText}>Chuyển Khoản Ngân Hàng</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        {paymentMethod === 'bank' && (
          <ThemedView style={styles.bankInfo}>
            <ThemedText style={styles.bankInfoTitle}>Thông Tin Chuyển Khoản</ThemedText>
            <ThemedText>Ngân hàng: Vietcombank</ThemedText>
            <ThemedText>Số tài khoản: 1234 5678 9012</ThemedText>
            <ThemedText>Chủ tài khoản: CÔNG TY HAPAS</ThemedText>
            <ThemedText>Nội dung: HAPAS_{shippingInfo.fullName || 'Mã đơn hàng'}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Tóm Tắt Đơn Hàng</ThemedText>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Tạm Tính</ThemedText>
          <ThemedText>${subtotal.toFixed(2)}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Vận Chuyển</ThemedText>
          <ThemedText>${shipping.toFixed(2)}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Thuế</ThemedText>
          <ThemedText>${tax.toFixed(2)}</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText type="defaultSemiBold">Tổng Cộng</ThemedText>
          <ThemedText type="defaultSemiBold">${total.toFixed(2)}</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <Button 
        title={loading ? "Đang xử lý..." : "Đặt Hàng"} 
        onPress={handlePlaceOrder} 
        style={styles.placeOrderButton}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: getTabBarHeight() + 20,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 10,
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedPaymentOption: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  paymentOptionText: {
    fontSize: 16,
  },
  bankInfo: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cce6ff',
  },
  bankInfoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    marginTop: 20,
  },
});