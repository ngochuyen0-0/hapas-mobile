import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Favorite = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
};

type FavoritesState = {
  items: Favorite[];
};

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Favorite }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: Favorite[] };

const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      // Check if item is already in favorites to avoid duplicates
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) {
        return state;
      }
      return {
        items: [...state.items, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case 'SET_FAVORITES':
      return {
        items: action.payload,
      };
    default:
      return state;
  }
};

type FavoritesContextType = {
  favorites: Favorite[];
  addFavorite: (product: Favorite) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(favoritesReducer, { items: [] });

  const addFavorite = (product: Favorite) => {
    dispatch({ type: 'ADD_FAVORITE', payload: product });
  };

  const removeFavorite = (id: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: id });
  };

  const isFavorite = (id: string) => {
    return state.items.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.items,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
