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
        Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Lỗi đăng nhập', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại!');
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
      <ThemedText type="title" style={styles.title}>Chào Mừng Đến Hapas</ThemedText>
      <ThemedText style={styles.subtitle}>Đăng nhập vào tài khoản của bạn</ThemedText>
      
      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            style={styles.input}
            value={credentials.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Nhập email của bạn"
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
  loginButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});