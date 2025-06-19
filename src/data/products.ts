import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max Titanium Shield',
    price: 129.99,
    originalPrice: 179.99,
    category: 'cases',
    brand: 'TitanGuard',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=500',
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Military-grade titanium case with aerospace engineering for ultimate protection and premium aesthetics.',
    features: ['Titanium Construction', 'Drop Protection 15ft', 'Wireless Charging', 'Precision Cutouts', 'Anti-Fingerprint'],
    compatibility: ['iPhone 15 Pro', 'iPhone 15 Pro Max'],
    inStock: true,
    rating: 4.9,
    reviews: 2847,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Galaxy S24 Ultra Diamond Glass Pro',
    price: 39.99,
    originalPrice: 59.99,
    category: 'tempered-glass',
    brand: 'DiamondShield',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Premium diamond-infused tempered glass with 9H+ hardness and crystal-clear transparency.',
    features: ['Diamond Coating', '9H+ Hardness', 'Oleophobic Layer', 'Edge-to-Edge', 'Easy Installation'],
    compatibility: ['Samsung Galaxy S24 Ultra'],
    inStock: true,
    rating: 4.8,
    reviews: 1923,
    isFeatured: true
  },
  {
    id: '3',
    name: 'MagSafe Wireless Charging Station Pro',
    price: 89.99,
    category: 'chargers',
    brand: 'PowerFlow',
    image: 'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Advanced 3-in-1 wireless charging station with MagSafe compatibility and intelligent power management.',
    features: ['15W Fast Charging', 'MagSafe Compatible', '3-Device Charging', 'LED Indicators', 'Foreign Object Detection'],
    compatibility: ['iPhone 12+', 'AirPods Pro', 'Apple Watch'],
    inStock: true,
    rating: 4.7,
    reviews: 1456,
    isFeatured: true
  },
  {
    id: '4',
    name: 'Premium Leather Wallet Case',
    price: 99.99,
    category: 'cases',
    brand: 'LuxCraft',
    image: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Handcrafted Italian leather wallet case with RFID blocking and premium card storage.',
    features: ['Italian Leather', 'RFID Blocking', '4 Card Slots', 'Cash Pocket', 'Magnetic Closure'],
    compatibility: ['iPhone 15', 'iPhone 15 Plus'],
    inStock: true,
    rating: 4.6,
    reviews: 892,
    isNew: true
  },
  {
    id: '5',
    name: 'USB-C Braided Cable 3-Pack',
    price: 34.99,
    originalPrice: 49.99,
    category: 'chargers',
    brand: 'PowerFlow',
    image: 'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Premium braided USB-C cables with reinforced connectors and 100W power delivery support.',
    features: ['100W Power Delivery', 'Braided Design', '3ft, 6ft, 10ft', 'Data Transfer 480Mbps', 'Lifetime Warranty'],
    compatibility: ['All USB-C devices'],
    inStock: true,
    rating: 4.5,
    reviews: 2341
  },
  {
    id: '6',
    name: 'Adjustable Phone Stand Pro',
    price: 29.99,
    category: 'accessories',
    brand: 'StandMaster',
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Ergonomic aluminum phone stand with 360° rotation and height adjustment for optimal viewing.',
    features: ['Aluminum Build', '360° Rotation', 'Height Adjustable', 'Foldable Design', 'Anti-Slip Base'],
    compatibility: ['All smartphones 4-12 inches'],
    inStock: true,
    rating: 4.4,
    reviews: 756
  },
  {
    id: '7',
    name: 'AirPods Pro 2 Leather Case',
    price: 49.99,
    category: 'cases',
    brand: 'LuxCraft',
    image: 'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Premium leather case for AirPods Pro with wireless charging compatibility and carabiner clip.',
    features: ['Genuine Leather', 'Wireless Charging', 'Carabiner Clip', 'Dust Protection', 'Easy Access'],
    compatibility: ['AirPods Pro 2nd Gen'],
    inStock: true,
    rating: 4.7,
    reviews: 634,
    isNew: true
  },
  {
    id: '8',
    name: 'Car Mount Wireless Charger',
    price: 69.99,
    category: 'chargers',
    brand: 'PowerFlow',
    image: 'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500',
    images: [
      'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=500'
    ],
    description: 'Smart car mount with 15W wireless charging and automatic phone clamping technology.',
    features: ['15W Fast Charging', 'Auto Clamping', 'Vent Mount', 'Dashboard Mount', 'One-Hand Operation'],
    compatibility: ['All Qi-enabled phones'],
    inStock: true,
    rating: 4.6,
    reviews: 1123
  }
];

export const featuredProducts = products.filter(product => product.isFeatured);
export const newProducts = products.filter(product => product.isNew);