export interface Product {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  price: number;
  originalPrice?: number;
  category: 'cases' | 'tempered-glass' | 'chargers' | 'accessories' | 'work-essentials';
  subcategory?: string;
  brand: string;
  image: string;
  images?: string[];
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  isNewProduct?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isTopRated?: boolean;
  isGift?: boolean;
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
  joinDate: string;
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  total: number;
  items: CartItem[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
}