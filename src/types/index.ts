export interface Product {
  id: string;
  _id?: string; // MongoDB ID
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
  isNewProduct?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isTopRated?: boolean;
  tags?: string[];
  coloredTags?: {
    label: string;
    color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'pink';
  }[];
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
  phone?: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  totalSpent: number;
  memberStatus: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: CartItem[];
}