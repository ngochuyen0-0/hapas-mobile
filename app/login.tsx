import { StyleSheet, Pressable, Text, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const success = await login(credentials.email, credentials.password);

      if (success) {
        router.push('/(tabs)');
      } else {
        Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Lỗi đăng nhập',
        'Đã xảy ra lỗi khi đăng nhập. Vui lòng kiểm tra kết nối mạng và thử lại!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials({ ...credentials, [field]: value });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Chào Mừng Đến Hapas
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Đăng nhập vào tài khoản của bạn
      </ThemedText>

      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={credentials.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#999" // Gray placeholder text
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Mật Khẩu</ThemedText>
          <TextInput
            style={styles.input}
            value={credentials.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#999" // Gray placeholder text
            secureTextEntry
          />
        </ThemedView>

        <Pressable
          style={[styles.loginButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </Text>
        </Pressable>

        <Pressable style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên Mật Khẩu?</Text>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.signupContainer}>
        <ThemedText>Chưa có tài khoản? </ThemedText>
        <Pressable onPress={handleSignUp}>
          <Text style={styles.signupText}>Đăng Ký</Text>
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
    backgroundColor: '#fff', // White background
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#000', // Black color for title
 },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#333', // Dark gray for subtitle
  },
  form: {
    marginBottom: 30,
    backgroundColor: '#ffffff', // White background form
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#000', // Black color for labels
 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd', // Gray border
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff', // White background for inputs
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FFB6C1', // Light pink login button matching signup
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#FFB6C1', // Light pink for disabled state matching signup
  },
  loginButtonText: {
    color: '#fff', // White text for better visibility on light pink button
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#FFB6C1', // Light pink for forgot password matching signup
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#FFB6C1', // Light pink for signup text matching signup
    fontWeight: 'bold',
  },
});
