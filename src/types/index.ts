export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'cases' | 'tempered-glass' | 'chargers' | 'accessories';
  brand: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  compatibility: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orders: Order[];
  wishlist: string[];
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: CartItem[];
}