import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditShippingAddressScreen() {
  const router = useRouter();
 const params = useLocalSearchParams();
  const { addressId } = params;
  
  const [addressData, setAddressData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    isDefault: false,
  });

  useEffect(() => {
    if (addressId) {
      loadAddress();
    }
  }, [addressId]);

  const loadAddress = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('shippingAddresses');
      if (savedAddresses) {
        const addresses = JSON.parse(savedAddresses);
        const address = addresses.find((addr: any) => addr.id === addressId);
        if (address) {
          setAddressData(address);
        }
      }
    } catch (error) {
      console.error('Error loading address:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin địa chỉ');
    }
  };

  const handleSave = async () => {
    if (!addressData.name || !addressData.phone || !addressData.address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    try {
      console.log('Updating address:', addressData);
      // Get existing addresses
      const savedAddresses = await AsyncStorage.getItem('shippingAddresses');
      console.log('Existing addresses from storage:', savedAddresses);
      const addresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      console.log('Parsed existing addresses:', addresses);
      
      // Find and update the specific address
      const addressIndex = addresses.findIndex((addr: any) => addr.id === addressData.id);
      console.log('Address index to update:', addressIndex);
      if (addressIndex !== -1) {
        // If setting as default, update other addresses to not be default
        if (addressData.isDefault) {
          addresses.forEach((addr: any) => {
            if (addr.id !== addressData.id) {
              addr.isDefault = false;
            }
          });
        }
        
        // Update the address
        addresses[addressIndex] = addressData;
        console.log('Updated address at index:', addressIndex, addresses[addressIndex]);
      }
      
      // Save updated addresses
      await AsyncStorage.setItem('shippingAddresses', JSON.stringify(addresses));
      console.log('Saved updated addresses to storage');
      
      // Verify the save was successful
      const savedData = await AsyncStorage.getItem('shippingAddresses');
      console.log('Verified saved data:', savedData ? JSON.parse(savedData) : 'No data found');
      
      Alert.alert('Thông báo', 'Địa chỉ đã được cập nhật thành công!', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/profile/shipping-address')
        }
      ]);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Lỗi', 'Không thể lưu địa chỉ. Vui lòng thử lại sau.');
    }
 };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/profile/shipping-address')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Chỉnh Sửa Địa Chỉ</ThemedText>
      </View>
      
      <ThemedView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Họ và tên</ThemedText>
          <TextInput
            style={styles.input}
            value={addressData.name}
            onChangeText={(text) => setAddressData({...addressData, name: text})}
            placeholder="Nhập họ và tên người nhận"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Số điện thoại</ThemedText>
          <TextInput
            style={styles.input}
            value={addressData.phone}
            onChangeText={(text) => setAddressData({...addressData, phone: text})}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Địa chỉ</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={addressData.address}
            onChangeText={(text) => setAddressData({...addressData, address: text})}
            placeholder="Nhập địa chỉ đầy đủ"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <Pressable 
          style={[styles.checkboxContainer, addressData.isDefault && styles.checkboxContainerSelected]}
          onPress={() => setAddressData({...addressData, isDefault: !addressData.isDefault})}
        >
          <View style={[styles.checkbox, addressData.isDefault && styles.checkboxSelected]}>
            {addressData.isDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <ThemedText style={styles.checkboxLabel}>Đặt làm địa chỉ mặc định</ThemedText>
        </Pressable>
        
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonText}>Lưu Thay Đổi</ThemedText>
        </Pressable>
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
  formContainer: {
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  checkboxContainerSelected: {
    backgroundColor: '#f0f0ff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});