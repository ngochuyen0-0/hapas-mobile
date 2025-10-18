import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/lib/apiClient';
import { User } from '@/types/api';

// Define the customer type that matches the API response
interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address: string;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

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
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUserData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      if (response.success && response.token && response.user) {
        const customer = response.user as Customer;
        const userToStore: User = {
          id: customer.id,
          full_name: customer.full_name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userToStore));
        await AsyncStorage.setItem('token', response.token);
        setAuthState({
          user: userToStore,
          token: response.token,
          isLoading: false,
        });
        return true;
      } else {
        console.error(response.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');

      setAuthState({
        user: null,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (
    full_name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.register(full_name, email, password);
      if (response.success) {
        return true;
      } else {
        console.error(response.errors);
        return false;
      }
    } catch (error) {
      console.error(error);
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
