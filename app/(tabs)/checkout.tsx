import { StyleSheet, View, Text, Pressable, TextInput, Platform, ScrollView, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
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
    phoneNumber: '',
    address: '',
    province: '',
    district: '',
    commune: '',
    zipCode: '',
    note: '',
  });
  
  type Location = {
    code: string;
    name: string;
    districts?: Location[];
    wards?: Location[];
  };
  
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [communes, setCommunes] = useState<Location[]>([]);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showCommuneModal, setShowCommuneModal] = useState(false);
  const [searchProvince, setSearchProvince] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchCommune, setSearchCommune] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  
  // Load provinces data on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const provincesData = require('../../data/vietnam-provinces.json');
        setProvinces(provincesData.provinces);
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    };
    
    loadProvinces();
  }, []);
  
  // Function to handle province selection
  const handleSelectProvince = (province: Location) => {
    setShippingInfo({ ...shippingInfo, province: province.name, district: '', commune: '' });
    setDistricts(province.districts || []);
    setCommunes([]);
    setShowProvinceModal(false);
    setSearchProvince('');
  };
  
  // Function to handle district selection
  const handleSelectDistrict = (district: Location) => {
    setShippingInfo({ ...shippingInfo, district: district.name, commune: '' });
    setCommunes(district.wards || []);
    setShowDistrictModal(false);
    setSearchDistrict('');
  };
  
 // Function to handle commune selection
  const handleSelectCommune = (commune: Location) => {
    setShippingInfo({ ...shippingInfo, commune: commune.name });
    setShowCommuneModal(false);
    setSearchCommune('');
  };
  
  // Filter functions for search
 const filteredProvinces = provinces.filter((province: Location) =>
    province.name.toLowerCase().includes(searchProvince.toLowerCase())
  );
  
  const filteredDistricts = districts.filter((district: Location) =>
    district.name.toLowerCase().includes(searchDistrict.toLowerCase())
  );
  
  const filteredCommunes = communes.filter((commune: Location) =>
    commune.name.toLowerCase().includes(searchCommune.toLowerCase())
  );

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!shippingInfo.fullName || !shippingInfo.phoneNumber || !shippingInfo.address || !shippingInfo.province || !shippingInfo.district || !shippingInfo.commune) {
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
        shipping_address: `${shippingInfo.fullName}, ${shippingInfo.phoneNumber}, ${shippingInfo.address}, ${shippingInfo.province}, ${shippingInfo.district}, ${shippingInfo.commune}, ${shippingInfo.zipCode}`,
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
          shippingInfo: JSON.stringify({
            fullName: shippingInfo.fullName,
            phoneNumber: shippingInfo.phoneNumber,
            address: shippingInfo.address,
            province: shippingInfo.province,
            district: shippingInfo.district,
            commune: shippingInfo.commune,
            note: shippingInfo.note,
          }),
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
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <ThemedText type="title" style={styles.title}>Thanh Toán</ThemedText>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Thông Tin Vận Chuyển</ThemedText>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Họ Và Tên *</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.fullName}
            onChangeText={(value) => handleInputChange('fullName', value)}
            placeholder="Nhập họ và tên"
          />
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Số Điện Thoại *</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Địa Chỉ *</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Nhập địa chỉ"
          />
        </ThemedView>
        
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.inputGroup, styles.flexOne]}>
            <ThemedText style={styles.label}>Tỉnh/Thành Phố *</ThemedText>
            <Pressable
              style={styles.input}
              onPress={() => setShowProvinceModal(true)}
            >
              <ThemedText style={{ color: shippingInfo.province ? '#000' : '#999' }}>
                {shippingInfo.province || 'Chọn tỉnh/thành phố'}
              </ThemedText>
            </Pressable>
          </ThemedView>
          
          <ThemedView style={[styles.inputGroup, styles.flexOne, styles.marginLeft]}>
            <ThemedText style={styles.label}>Quận/Huyện *</ThemedText>
            <Pressable
              style={styles.input}
              onPress={() => {
                if (!shippingInfo.province) {
                  Alert.alert('Thông báo', 'Vui lòng chọn tỉnh/thành phố trước');
                  return;
                }
                setShowDistrictModal(true);
              }}
            >
              <ThemedText style={{ color: shippingInfo.district ? '#000' : '#99' }}>
                {shippingInfo.district || 'Chọn quận/huyện'}
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.inputGroup, styles.flexOne]}>
            <ThemedText style={styles.label}>Phường/Xã *</ThemedText>
            <Pressable
              style={styles.input}
              onPress={() => {
                if (!shippingInfo.district) {
                  Alert.alert('Thông báo', 'Vui lòng chọn quận/huyện trước');
                  return;
                }
                setShowCommuneModal(true);
              }}
            >
              <ThemedText style={{ color: shippingInfo.commune ? '#000' : '#999' }}>
                {shippingInfo.commune || 'Chọn phường/xã'}
              </ThemedText>
            </Pressable>
          </ThemedView>
          
          <ThemedView style={[styles.inputGroup, styles.flexOne, styles.marginLeft]}>
            <ThemedText style={styles.label}>Mã Bưu Chính</ThemedText>
            <TextInput
              style={styles.input}
              value={shippingInfo.zipCode}
              onChangeText={(value) => handleInputChange('zipCode', value)}
              placeholder="Nhập mã bưu chính"
              keyboardType="numeric"
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Ghi Chú Cho Đơn Hàng</ThemedText>
          <TextInput
            style={styles.input}
            value={shippingInfo.note}
            onChangeText={(value) => handleInputChange('note', value)}
            placeholder="Ghi chú cho đơn hàng"
            multiline
            numberOfLines={3}
          />
        </ThemedView>
        
        {/* Province Selection Modal */}
        <Modal
          visible={showProvinceModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowProvinceModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle" style={styles.modalTitle}>Chọn Tỉnh/Thành Phố</ThemedText>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tỉnh/thành phố..."
                value={searchProvince}
                onChangeText={setSearchProvince}
              />
              
              <FlatList
                data={filteredProvinces}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => handleSelectProvince(item)}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </Pressable>
                )}
                style={styles.modalList}
              />
              
              <Button
                title="Đóng"
                onPress={() => setShowProvinceModal(false)}
                style={styles.modalCloseButton}
              />
            </View>
          </View>
        </Modal>
        
        {/* District Selection Modal */}
        <Modal
          visible={showDistrictModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDistrictModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle" style={styles.modalTitle}>Chọn Quận/Huyện</ThemedText>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm quận/huyện..."
                value={searchDistrict}
                onChangeText={setSearchDistrict}
              />
              
              <FlatList
                data={filteredDistricts}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => handleSelectDistrict(item)}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </Pressable>
                )}
                style={styles.modalList}
              />
              
              <Button
                title="Đóng"
                onPress={() => setShowDistrictModal(false)}
                style={styles.modalCloseButton}
              />
            </View>
          </View>
        </Modal>
        
        {/* Commune Selection Modal */}
        <Modal
          visible={showCommuneModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCommuneModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ThemedText type="subtitle" style={styles.modalTitle}>Chọn Phường/Xã</ThemedText>
              
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm phường/xã..."
                value={searchCommune}
                onChangeText={setSearchCommune}
              />
              
              <FlatList
                data={filteredCommunes}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => handleSelectCommune(item)}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </Pressable>
                )}
                style={styles.modalList}
              />
              
              <Button
                title="Đóng"
                onPress={() => setShowCommuneModal(false)}
                style={styles.modalCloseButton}
              />
            </View>
          </View>
        </Modal>
        
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
        <ThemedText type="subtitle" style={styles.sectionTitle}>Đơn Hàng Của Bạn </ThemedText>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Tạm Tính</ThemedText>
          <ThemedText>{subtotal.toLocaleString('vi-VN')}₫</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Vận Chuyển</ThemedText>
          <ThemedText>Miễn phí</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Thuế</ThemedText>
          <ThemedText>{tax.toLocaleString('vi-VN')}₫</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText type="defaultSemiBold">Tổng Cộng</ThemedText>
          <ThemedText type="defaultSemiBold">{total.toLocaleString('vi-VN')}₫</ThemedText>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  modalCloseButton: {
    marginTop: 10,
  },
});