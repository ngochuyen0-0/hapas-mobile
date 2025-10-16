import { StyleSheet, View, Text, FlatList, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  
  useEffect(() => {
    // Mock data for payment methods
    setPaymentMethods([
      { 
        id: '1', 
        type: 'Visa',
        number: '**** **** **** 1234',
        expiry: '12/25',
        isDefault: true
      },
      { 
        id: '2', 
        type: 'Mastercard',
        number: '**** **** **** 5678',
        expiry: '08/24',
        isDefault: false
      },
      { 
        id: '3', 
        type: 'PayPal',
        number: 'user@example.com',
        expiry: '',
        isDefault: false
      },
    ]);
  }, []);

  const renderPaymentMethod = ({ item }: { item: any }) => (
    <ThemedView style={[styles.paymentItem, item.isDefault && styles.defaultPayment]}>
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <ThemedText style={styles.paymentType}>{item.type}</ThemedText>
          <ThemedText style={styles.paymentNumber}>{item.number}</ThemedText>
          {item.expiry ? <ThemedText style={styles.paymentExpiry}>Hết hạn: {item.expiry}</ThemedText> : null}
        </View>
        <View style={styles.paymentActions}>
          {!item.isDefault && (
            <Pressable style={styles.setDefaultButton} onPress={() => setDefaultMethod(item.id)}>
              <ThemedText style={styles.setDefaultButtonText}>Đặt mặc định</ThemedText>
            </Pressable>
          )}
          <Pressable style={styles.deleteButton} onPress={() => Alert.alert('Xóa phương thức', `Bạn có chắc muốn xóa phương thức thanh toán này?`, [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', onPress: () => setPaymentMethods(paymentMethods.filter(method => method.id !== item.id)) }
          ])}>
            <ThemedText style={styles.deleteButtonText}>Xóa</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );

  const setDefaultMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Phương Thức Thanh Toán</ThemedText>
      </View>
      
      <ThemedView style={styles.content}>
        <FlatList
          data={paymentMethods}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          showsVerticalScrollIndicator={false}
        />
        
        <Pressable style={styles.addButton} onPress={() => Alert.alert('Thêm phương thức mới', 'Tính năng sẽ được cập nhật trong phiên bản tiếp theo')}>
          <Ionicons name="add" size={24} color="#fff" />
          <ThemedText style={styles.addButtonText}>Thêm Phương Thức Mới</ThemedText>
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
  content: {
    flex: 1,
  },
  paymentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  defaultPayment: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    flex: 1,
  },
 paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  paymentNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  paymentExpiry: {
    fontSize: 12,
    color: '#999',
  },
  paymentActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  setDefaultButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 5,
  },
  setDefaultButtonText: {
    fontSize: 12,
    color: '#333',
 },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});