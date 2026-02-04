import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  categories: string[];
  brands: string[];
}

interface ProductContextType extends ProductState {
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  getProductsByFilter: (filter: string) => Product[];
  getProductsBySubcategory: (category: string, subcategory: string) => Product[];
  searchProducts: (query: string) => Product[];
  filterProducts: (filters: ProductFilters) => Product[];
  getFeaturedProducts: () => Product[];
}

interface ProductFilters {
  category?: string;
  subcategory?: string;
  filter?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

type ProductAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_FETCHED'; payload: number };

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PRODUCTS': {
      const products = action.payload;
      const categories = [...new Set(products.map(p => p.category))];
      const brands = [...new Set(products.map(p => p.brand))].sort();
      return { 
        ...state, 
        products, 
        categories, 
        brands, 
        loading: false, 
        error: null 
      };
    }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LAST_FETCHED':
      return { ...state, lastFetched: action.payload };
    default:
      return state;
  }
};

const initialState: ProductState = {
  products: [],
  loading: true,
  error: null,
  lastFetched: null,
  categories: [],
  brands: []
};

// Cache duration: 5 minutes
const CACHE_DURATION = 60 * 60 * 1000;

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchProducts = async (force = false) => {
    // Check if we have cached data and it's still fresh
    if (!force && state.products.length > 0 && state.lastFetched) {
      const now = Date.now();
      if (now - state.lastFetched < CACHE_DURATION) {
        return; // Use cached data
      }
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.get('/products', {
        params: {
          limit: 100, // Cap at 100 (server enforces max)
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      
      // Transform products to ensure consistent ID handling
      const products = response.data.products.map((product: any) => ({
        ...product,
        id: product.id || product._id, // Always ensure id exists
      }));
      
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_LAST_FETCHED', payload: Date.now() });
      
      // Cache in localStorage for persistence across sessions
      localStorage.setItem('productsCache', JSON.stringify({
        products,
        timestamp: Date.now()
      }));
    } catch (err: any) {
      console.error('Error fetching products:', err);
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to fetch products' });
    }
  };

  const refreshProducts = async () => {
    await fetchProducts(true);
  };

  // Load from cache on mount
  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = localStorage.getItem('productsCache');
        if (cached) {
          const { products, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          // If cache is still fresh, use it
          if (now - timestamp < CACHE_DURATION) {
            dispatch({ type: 'SET_PRODUCTS', payload: products });
            dispatch({ type: 'SET_LAST_FETCHED', payload: timestamp });
            return true;
          }
        }
      } catch (error) {
        console.error('Error loading from cache:', error);
        localStorage.removeItem('productsCache');
      }
      return false;
    };

    // Try to load from cache first
    const cacheLoaded = loadFromCache();
    
    // If no cache or cache is stale, fetch fresh data
    if (!cacheLoaded) {
      fetchProducts();
    }
  }, []);

  // Helper functions for filtering
  const getProductsByCategory = (category: string): Product[] => {
    return state.products.filter(product => 
      product.category === category && product.inStock
    );
  };

  const getProductsByFilter = (filter: string): Product[] => {
    switch (filter) {
      case 'new':
        return state.products.filter(product => 
          product.isNewProduct && product.inStock
        );
      case 'gifts':
        return state.products.filter(product => 
          product.isGift && product.inStock
        );
      case 'featured':
        return state.products.filter(product => 
          product.isFeatured && product.inStock
        );
      case 'sale':
        return state.products.filter(product => 
          product.isOnSale && product.inStock
        );
      default:
        return state.products.filter(product => product.inStock);
    }
  };

  const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
    return state.products.filter(product => 
      product.category === category && 
      product.subcategory === subcategory && 
      product.inStock
    );
  };

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return state.products.filter(product => product.inStock);
    
    const searchTerm = query.toLowerCase();
    return state.products.filter(product => 
      product.inStock && (
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      )
    );
  };

  const filterProducts = useCallback((filters: ProductFilters): Product[] => {
    let filtered = state.products.filter(product => product.inStock);

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    }

    if (filters.filter) {
      switch (filters.filter) {
        case 'new':
          filtered = filtered.filter(product => product.isNewProduct);
          break;
        case 'gifts':
          filtered = filtered.filter(product => product.isGift);
          break;
        case 'featured':
          filtered = filtered.filter(product => product.isFeatured);
          break;
        case 'sale':
          filtered = filtered.filter(product => product.isOnSale);
          break;
      }
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!);
    }

    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating!);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any = a[filters.sortBy as keyof Product];
        let bValue: any = b[filters.sortBy as keyof Product];

        if (filters.sortBy === 'name') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
        } else {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  }, [state.products]);

  const getFeaturedProducts = (): Product[] => {
    return state.products.filter(product => 
      product.isFeatured && product.inStock
    ).slice(0, 8); // Limit to 8 featured products
  };

  return (
    <ProductContext.Provider value={{
      ...state,
      refreshProducts,
      getProductsByCategory,
      getProductsByFilter,
      getProductsBySubcategory,
      searchProducts,
      filterProducts,
      getFeaturedProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
