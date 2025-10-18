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
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import React from 'react';

export default function ShippingAddressScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);

  // useEffect(() => {
  //   loadAddresses();
  // }, []);

  // Refetch addresses when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('useFocusEffect called - reloading addresses');
      loadAddresses();
    }, []),
  );

  const loadAddresses = async () => {
    console.log('loadAddresses function called');
    try {
      console.log('Loading addresses from storage...');
      const savedAddresses = await AsyncStorage.getItem('shippingAddresses');
      console.log('Raw saved addresses from storage:', savedAddresses);

      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        console.log('Loaded addresses from storage:', parsedAddresses);
        setAddresses(parsedAddresses);
      } else {
        // Empty array if none exist
        console.log('No addresses found, setting empty array');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      Alert.alert('Lỗi', 'Không thể tải địa chỉ. Vui lòng thử lại sau.');
    }
  };

  const deleteAddress = async (id: string) => {
    console.log('Delete address function called with ID:', id);
    Alert.alert('Xóa địa chỉ', 'Bạn có chắc muốn xóa địa chỉ này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('User confirmed deletion for address ID:', id);

            // Use functional update to ensure we have the latest addresses
            setAddresses((prevAddresses) => {
              console.log('Current addresses (from state):', prevAddresses);

              const updatedAddresses = prevAddresses.filter(
                (addr) => addr.id !== id,
              );
              console.log(
                'Updated addresses after deletion:',
                updatedAddresses,
              );

              // If the deleted address was default and there are other addresses, set the first as default
              if (
                prevAddresses.find((addr) => addr.id === id)?.isDefault &&
                updatedAddresses.length > 0
              ) {
                updatedAddresses[0].isDefault = true;
                console.log(
                  'Set first address as default:',
                  updatedAddresses[0],
                );
              }

              // Save to storage
              AsyncStorage.setItem(
                'shippingAddresses',
                JSON.stringify(updatedAddresses),
              )
                .then(() => {
                  console.log('Saved updated addresses to storage');

                  // Verify that the data was actually saved
                  return AsyncStorage.getItem('shippingAddresses');
                })
                .then((verifySaved) => {
                  console.log(
                    'Verification - Saved data in storage:',
                    verifySaved,
                  );

                  Alert.alert('Thành công', 'Địa chỉ đã được xóa thành công!', [
                    { text: 'OK' },
                  ]);
                })
                .catch((error) => {
                  console.error('Error saving addresses:', error);
                  Alert.alert(
                    'Lỗi',
                    'Không thể lưu địa chỉ. Vui lòng thử lại sau.',
                  );
                });

              return updatedAddresses;
            });
          } catch (error) {
            console.error('Error deleting address:', error);
            Alert.alert('Lỗi', 'Không thể xóa địa chỉ. Vui lòng thử lại sau.');
          }
        },
      },
    ]);
  };

  const renderAddressItem = ({ item }: { item: any }) => (
    <ThemedView
      style={[styles.addressItem, item.isDefault && styles.defaultAddress]}
    >
      <View style={styles.addressHeader}>
        <ThemedText style={styles.addressName}>{item.name}</ThemedText>
        {item.isDefault && (
          <ThemedText style={styles.defaultTag}>Mặc định</ThemedText>
        )}
      </View>
      <ThemedText style={styles.addressPhone}>{item.phone}</ThemedText>
      <ThemedText style={styles.addressText}>{item.address}</ThemedText>
      <View style={styles.addressActions}>
        <Pressable
          style={styles.editButton}
          onPress={() =>
            router.push(
              `/(tabs)/profile/edit-shipping-address?addressId=${item.id}`,
            )
          }
        >
          <ThemedText style={styles.editButtonText}>Sửa</ThemedText>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            console.log('Delete button pressed for address ID:', item.id);
            deleteAddress(item.id);
          }}
        >
          <ThemedText style={styles.deleteButtonText}>Xóa</ThemedText>
        </Pressable>
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
          Địa Chỉ Giao Hàng
        </ThemedText>
      </View>

      <ThemedView style={styles.content}>
        {addresses.length > 0 ? (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={renderAddressItem}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Bạn chưa có địa chỉ giao hàng nào
            </ThemedText>
            <ThemedText style={styles.emptySubText}>
              Hãy thêm địa chỉ mới để bắt đầu
            </ThemedText>
          </ThemedView>
        )}

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/profile/add-shipping-address')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <ThemedText style={styles.addButtonText}>Thêm Địa Chỉ Mới</ThemedText>
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
  addressItem: {
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
  defaultAddress: {
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  defaultTag: {
    fontSize: 12,
    color: '#6200ee',
    fontWeight: '600',
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ff6b6b',
    borderRadius: 6,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
