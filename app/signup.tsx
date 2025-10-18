import { StyleSheet, Pressable, Text, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  const handleSignUp = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!validateEmail(userInfo.email)) {
      Alert.alert('Thông báo', 'Email không đúng định dạng');
      return;
    }
    if (!validatePassword(userInfo.password)) {
      Alert.alert(
        'Thông báo',
        'Mật khẩu phải có 8 ký tự bao gồm chữ hoa, chữ thường và số',
      );
      return;
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const success = await register(
        userInfo.name,
        userInfo.email,
        userInfo.password,
      );

      if (success) {
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
          { text: 'OK', onPress: () => router.push('/(tabs)') },
        ]);
      } else {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Tạo Tài Khoản
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Tạo tài khoản mới để mua sắm
      </ThemedText>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Họ Và Tên</ThemedText>
          <TextInput
            style={styles.input}
            value={userInfo.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Nhập họ và tên"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={userInfo.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Nhập email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Mật Khẩu</ThemedText>
          <TextInput
            style={styles.input}
            value={userInfo.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Nhập mật khẩu"
            secureTextEntry
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Xác Nhận Mật Khẩu</ThemedText>
          <TextInput
            style={styles.input}
            value={userInfo.confirmPassword}
            onChangeText={(value) =>
              handleInputChange('confirmPassword', value)
            }
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
          />
        </ThemedView>

        <Pressable
          style={[styles.signUpButton, loading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signUpButtonText}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </Text>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.loginContainer}>
        <ThemedText>Đã có tài khoản? </ThemedText>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
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
  signUpButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
