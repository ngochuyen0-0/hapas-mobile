// TypeScript interfaces for API responses

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  image_urls?: string;
  category?: Category | string;
  material?: string;
  color?: string;
  size?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  reviews?: ProductReview[];
  is_favorite?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    image_urls: string;
    image?: string;
  };
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  shipping_address?: string;
  billing_address?: string;
  note?: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  transaction_id?: string;
  status: string;
  amount: number;
  payment_date: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AuthResponse {
  message?: string;
  success: boolean;
  token?: string;
  user?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
