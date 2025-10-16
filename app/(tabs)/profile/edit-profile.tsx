import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
 const [formData, setFormData] = useState({
    name: 'Nguyễn Ngọc Huyền',
    email: 'nguyenngochuyen@example.com',
    phone: '+84 123 456 789',
    address: '123 Đường ABC, Quận XYZ, TP. HCM',
  });

  useEffect(() => {
    // Load user data from storage or set defaults
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('Loading user data...'); // Debug log
      const savedData = await AsyncStorage.getItem('userProfile');
      console.log('Retrieved saved data:', savedData); // Debug log
      if (savedData) {
        const userData = JSON.parse(savedData);
        setFormData(userData);
        console.log('Loaded user data:', userData); // Debug log
      } else {
        console.log('No saved data found, using defaults'); // Debug log
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
 };

  const saveUserData = async () => {
    try {
      console.log('Saving user data:', formData); // Debug log
      await AsyncStorage.setItem('userProfile', JSON.stringify(formData));
      console.log('User data saved successfully'); // Debug log
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error; // Re-throw the error so it can be caught by the calling function
    }
 };

  const handleSave = async () => {
    try {
      // Save user data to storage
      await saveUserData();
      
      Alert.alert('Thông báo', 'Thông tin cá nhân đã được cập nhật thành công!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate specifically to the profile page
            router.push('/(tabs)/profile');
          }
        }
      ]);
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin cá nhân. Vui lòng thử lại sau.');
    }
 };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <ThemedText type="title" style={styles.title}>Chỉnh Sửa Hồ Sơ</ThemedText>
      </View>
      
      <ThemedView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Họ và tên</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData(prevData => ({...prevData, name: text}))}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData(prevData => ({...prevData, email: text}))}
            keyboardType="email-address"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Số điện thoại</ThemedText>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData(prevData => ({...prevData, phone: text}))}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Địa chỉ</ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => setFormData(prevData => ({...prevData, address: text}))}
            multiline
            numberOfLines={3}
          />
        </View>
        
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
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});