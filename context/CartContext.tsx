import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      // Ensure payload is an array before using reduce
      const items = Array.isArray(action.payload) ? action.payload : [];
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        ...state,
        items,
        total,
      };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );
      let updatedItems;

      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      };

    case 'REMOVE_FROM_CART':
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload,
      );
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      };

    case 'UPDATE_QUANTITY':
      const updatedQuantityItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item,
      );
      return {
        ...state,
        items: updatedQuantityItems,
        total: updatedQuantityItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Ensure parsedCart is an array before dispatching
          if (Array.isArray(parsedCart)) {
            // Calculate total when loading from storage
            const total = parsedCart.reduce((sum: number, item: CartItem) =>
              sum + item.price * item.quantity, 0);
            // Set the cart with items and calculated total
            dispatch({ type: 'SET_CART', payload: parsedCart });
          }
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
        // Don't reset the cart if there's an error loading from storage
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to AsyncStorage:', error);
      }
    };

    saveCart();
  }, [state.items]); // Only save items, not the entire state object

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
