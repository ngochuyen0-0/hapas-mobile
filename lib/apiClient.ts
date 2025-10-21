import { Platform } from 'react-native';
import { Product, AuthResponse, User, Order, Category } from '@/types/api';

// Determine the base URL for API calls
const getBaseUrl = () => {
  // When running on emulator/simulator, we need to use the host machine's IP
 // For production, you would use your actual API domain
  if (__DEV__) {
    // For Android emulator, use 10.0.2.2 to access host machine
    // For iOS simulator, use localhost
    if (__DEV__) {
      // For Android emulator, use 10.0.2.2 to access host machine
      // For iOS simulator, use localhost
      return Platform.OS === 'android'
        ? 'http://10.0.2.2:3000'
        : 'http://localhost:3000'; // iOS simulator and web
    }
    // In production, use your actual domain
    return 'http://localhost:3000';
  }
  // In production, use your actual domain
  return 'https://your-production-domain.com'; // Update this to your actual domain
};

const BASE_URL = getBaseUrl();

// Helper function to get the first image URL from image_urls
const getFirstImageUrl = (
  imageUrls: string | null | undefined,
): string | undefined => {
  if (!imageUrls) return undefined;

  const urls = imageUrls.startsWith('data:image')
    ? [imageUrls]
    : imageUrls.split(',');
  const firstUrl = urls[0].trim();
  return firstUrl || undefined;
};

// Generic API fetch function
export const apiClient = {
  // Fetch all products (public endpoint)
  async getProducts(): Promise<Product[]> {
    try {
      // Request all products by setting a high limit
      const response = await fetch(`${BASE_URL}/api/public/products?limit=1000`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      // Map image_urls to image field for mobile app compatibility
      const products = (data.products || data || []).map((product: any) => ({
        ...product,
        image: product.image || getFirstImageUrl(product.image_urls),
      }));

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Search products by query (public endpoint)
  async searchProducts(query: string, categoryId?: string): Promise<Product[]> {
    try {
      let url = `${BASE_URL}/api/public/products/search?q=${encodeURIComponent(
        query,
      )}`;
      if (categoryId) {
        url += `&category_id=${encodeURIComponent(categoryId)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search products');
      }

      // Map image_urls to image field for mobile app compatibility
      const products = (data.products || []).map((product: any) => ({
        ...product,
        image: product.image || getFirstImageUrl(product.image_urls),
      }));

      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Fetch a single product by ID (public endpoint)
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/api/public/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }

      const product = data.product || data;

      // Map image_urls to image field for mobile app compatibility
      return {
        ...product,
        image: product.image || getFirstImageUrl(product.image_urls),
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Fetch all categories (public endpoint)
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/public/categories`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch products by category ID (public endpoint)
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/api/public/products?category_id=${encodeURIComponent(
          categoryId,
        )}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products by category');
      }

      // Map image_urls to image field for mobile app compatibility
      const products = (data.products || []).map((product: any) => ({
        ...product,
        image: product.image || getFirstImageUrl(product.image_urls),
      }));

      return products;
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error,
      );
      throw error;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response)
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(full_name: string, email: string, password: string, phone?: string) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name, email, password, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.errors);
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  // Get user profile
  async getProfile(token: string): Promise<User> {
    try {
      const response = await fetch(`${BASE_URL}/api/customer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.user || data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Get user orders
  async getOrders(token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/customer/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch orders');
      }

      // Map the response to ensure proper structure
      const orders = data.orders || [];
      
      return orders.map((order: any) => ({
        ...order,
        user_id: order.customer_id, // Map customer_id to user_id for consistency
        items: order.order_items, // Map order_items to items
        total_amount: Number(order.total_amount), // Ensure total_amount is a number
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Create an order
  async createOrder(token: string, orderData: any) {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
};
