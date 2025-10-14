import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
interface FavoritesState {
  favoriteIds: string[];
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] };

// Initial state
const initialState: FavoritesState = {
  favoriteIds: [],
};

// Reducer
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'SET_FAVORITES':
      return {
        ...state,
        favoriteIds: Array.isArray(action.payload) ? action.payload : [],
      };

    case 'ADD_FAVORITE':
      if (state.favoriteIds.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favoriteIds: [...state.favoriteIds, action.payload],
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favoriteIds: state.favoriteIds.filter(id => id !== action.payload),
      };

    default:
      return state;
  }
}

// Create context
const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
} | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState, () => {
    // We'll load the favorites data asynchronously in an effect below
    return initialState;
  });

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          // Ensure parsedFavorites is an array before dispatching
          if (Array.isArray(parsedFavorites)) {
            dispatch({ type: 'SET_FAVORITES', payload: parsedFavorites });
          }
        }
      } catch (error) {
        console.error('Error loading favorites from AsyncStorage:', error);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever it changes
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
      } catch (error) {
        console.error('Error saving favorites to AsyncStorage:', error);
      }
    };

    saveFavorites();
  }, [state]);

  const addFavorite = (id: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: id });
  };

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const isFavorite = (id: string) => {
    return state.favoriteIds.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        state,
        dispatch,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};