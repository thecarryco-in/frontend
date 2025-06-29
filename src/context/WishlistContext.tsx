import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  itemCount: number;
}

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistAction = 
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

// Helper function to safely get product ID
const getProductId = (product: Product): string => {
  return product.id || product._id || '';
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const productId = getProductId(action.payload);
      if (!productId) {
        console.error('Product missing ID:', action.payload);
        return state;
      }

      const existingItem = state.items.find(item => getProductId(item) === productId);
      if (existingItem) return state;
      
      const newItems = [...state.items, action.payload];
      return {
        items: newItems,
        itemCount: newItems.length
      };
    }
    
    case 'REMOVE_FROM_WISHLIST': {
      if (!action.payload) {
        console.error('Cannot remove product without ID from wishlist');
        return state;
      }

      const newItems = state.items.filter(item => getProductId(item) !== action.payload);
      return {
        items: newItems,
        itemCount: newItems.length
      };
    }
    
    case 'CLEAR_WISHLIST':
      return { items: [], itemCount: 0 };
    
    case 'LOAD_WISHLIST':
      return {
        items: action.payload,
        itemCount: action.payload.length
      };
    
    default:
      return state;
  }
};

const initialState: WishlistState = {
  items: [],
  itemCount: 0,
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        // Ensure all products have valid IDs
        const validWishlist = parsedWishlist.filter((product: Product) => {
          const productId = getProductId(product);
          if (!productId) {
            console.warn('Removing wishlist item with invalid product ID:', product);
            return false;
          }
          return true;
        });
        dispatch({ type: 'LOAD_WISHLIST', payload: validWishlist });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const addToWishlist = (product: Product) => {
    // Ensure product has an ID
    if (!getProductId(product)) {
      console.error('Cannot add product without ID to wishlist:', product);
      return;
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = (productId: string) => {
    if (!productId) {
      console.error('Cannot remove product without ID from wishlist');
      return;
    }
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const isInWishlist = (productId: string) => {
    if (!productId) return false;
    return state.items.some(item => getProductId(item) === productId);
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  return (
    <WishlistContext.Provider value={{
      ...state,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};