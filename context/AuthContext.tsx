import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/lib/apiClient';
import { User } from '@/types/api';

// Define the customer type that matches the API response
interface Customer {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Load user data from storage on app start
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        
        if (userData && token) {
          setAuthState({
            user: JSON.parse(userData),
            token,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Make API call to authenticate the user
      const response = await apiClient.login(email, password);
      
      // Check if response indicates success
      if (response.success && response.token && response.user) {
        // The API returns customer with full_name, but our User interface expects name
        // We need to cast to Customer to access full_name
        const customer = response.user as Customer;
        const userToStore: User = {
          id: customer.id,
          name: customer.full_name || customer.name || 'User',
          email: customer.email
        };
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
        await AsyncStorage.setItem('token', response.token);
        
        setAuthState({
          user: userToStore,
          token: response.token,
          isLoading: false,
        });
        
        return true;
      } else {
        // Handle unsuccessful login (when success is false or missing required fields)
        console.error('Login failed:', response.message || 'Invalid response structure');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Clear from AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Make API call to register the user
      const response = await apiClient.login(email, password); // Using login endpoint for now, should be register
      
      // Check if response indicates success
      if (response.success && response.token && response.user) {
        // The API returns customer with full_name, but our User interface expects name
        // We need to cast to Customer to access full_name
        const customer = response.user as Customer;
        const userToStore: User = {
          id: customer.id,
          name: customer.full_name || customer.name || name,
          email: customer.email
        };
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
        await AsyncStorage.setItem('token', response.token);
        
        setAuthState({
          user: userToStore,
          token: response.token,
          isLoading: false,
        });
        
        return true;
      } else {
        // Handle unsuccessful registration (when success is false or missing required fields)
        console.error('Registration failed:', response.message || 'Invalid response structure');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};