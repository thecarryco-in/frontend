import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, CreditCard, User, MapPin, Phone, ChevronDown, ChevronUp, Info, LogIn, CheckCircle, AlertTriangle, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Custom notification component
const Notification: React.FC<{ 
  type: 'success' | 'error' | 'info'; 
  message: string; 
  onClose: () => void 
}> = ({ type, message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error': return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'info': return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className={`fixed top-24 right-4 z-50 ${getColors()} backdrop-blur-md rounded-2xl p-6 border max-w-md animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-white font-medium leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Calculate shipping charges based on tax-inclusive amount
  const SHIPPING_THRESHOLD = 398;
  const SHIPPING_CHARGE = 70;
  const totalIncludingTax = total * 1.18; // Tax-inclusive subtotal
  const isShippingFree = totalIncludingTax > SHIPPING_THRESHOLD;
  const shippingCost = isShippingFree ? 0 : SHIPPING_CHARGE;
  
  // Apply coupon discount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalAfterDiscount = totalIncludingTax - discountAmount;
  
  // Final totals
  const finalTotalWithShipping = totalAfterDiscount + (shippingCost * 1.18); // Shipping also has tax

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      showNotification('error', 'Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await axios.post('/coupons/validate', {
        code: couponCode.trim(),
        cartTotal: totalIncludingTax
      });

      setAppliedCoupon(response.data);
      showNotification('success', `Coupon applied! You saved ₹${response.data.discountAmount}`);
    } catch (error: any) {
      showNotification('error', error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showNotification('info', 'Coupon removed');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Calculate total savings based on original prices
  const totalSavings = items.reduce((sum, item) => {
    const original = item.product.originalPrice || 0;
    const current = item.product.price;
    if (original > current) {
      return sum + (original - current) * item.quantity;
    }
    return sum;
  }, 0);

  // Helper function to safely get product ID
  const getProductId = (product: any): string => {
    return product.id || product._id || '';
  };

  const handlePayment = async () => {
    // Check authentication at payment time
    if (!isAuthenticated) {
      // Store current cart state and redirect to login
      localStorage.setItem('pendingCheckout', 'true');
      navigate('/login');
      return;
    }

    // Validate shipping address
    const { name, phone, address, city, state, pincode } = shippingAddress;
    if (
      !name.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      showNotification('error', 'Please fill in all shipping address fields.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      showNotification('error', 'Phone number must be exactly 10 digits.');
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      showNotification('error', 'Pincode must be exactly 6 digits.');
      return;
    }
    if (!items || items.length === 0) {
      showNotification('error', 'Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showNotification('error', 'Failed to load payment gateway. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Create order with proper product data including shipping and coupon
      const orderData = {
        items: items.map(item => {
          const productId = getProductId(item.product);
          if (!productId) {
            throw new Error(`Product missing ID: ${item.product.name}`);
          }
          return {
            productId,
            quantity: item.quantity
          };
        }),
        shippingAddress,
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : null
      };

      console.log('Order data being sent:', orderData);

      const response = await axios.post('/orders/create-order', orderData);
      const { razorpayOrderId, amount, currency, key, orderCalculation } = response.data;

      // Razorpay options
      const options = {
        key,
        amount,
        currency,
        name: 'The CarryCo',
        description: 'Premium Mobile Accessories',
        order_id: razorpayOrderId,
        handler: async (rzpResponse: any) => {
          try {
            // Verify payment and send all required data
            await axios.post('/orders/verify-payment', {
              razorpayPaymentId: rzpResponse.razorpay_payment_id,
              razorpayOrderId: rzpResponse.razorpay_order_id,
              razorpaySignature: rzpResponse.razorpay_signature,
              items: orderData.items,
              shippingAddress: orderData.shippingAddress,
              couponCode: orderData.couponCode
            });

            clearCart(false); // Do not show toast when clearing cart after payment
            setAppliedCoupon(null);
            setCouponCode('');
            localStorage.removeItem('pendingCheckout');
            toast.success('Thanks for Purchase!');
            setTimeout(() => navigate('/dashboard?tab=orders'), 2000);
          } catch (error) {
            console.error('Payment verification failed:', error);
            showNotification('error', 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.name,
          email: user?.email,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      showNotification('error', error.response?.data?.message || error.message || 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/10">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl"></div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Your Cart is Empty
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Discover our premium collection of mobile accessories and find the perfect items for your device.
            </p>
            
            <Link
              to="/shop"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10">Start Shopping</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-12">
          {/* Cart Items */}
          <div className="xl:w-2/3">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
                <p className="text-gray-400 mt-2">{itemCount} items in your cart</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Are you sure you want to clear your cart? This action cannot be undone.')) {
                    clearCart(true);
                  }
                }}
                className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors duration-200 hover:bg-red-500/10 px-4 py-2 rounded-lg"
              >
                Clear All Items
              </button>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => {
                const itemPriceIncludingTax = item.product.price * 1.18;
                const itemOriginalPriceIncludingTax = item.product.originalPrice ? item.product.originalPrice * 1.18 : 0;
                const productId = getProductId(item.product);
                
                // Skip items without valid IDs
                if (!productId) {
                  console.warn('Cart item missing product ID:', item);
                  return null;
                }
                
                return (
                  <div 
                    key={productId} 
                    className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Product Image */}
                      <div className="lg:w-32 lg:h-32 w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                          <p className="text-purple-400 font-semibold text-sm uppercase tracking-wide">{item.product.brand}</p>
                          <p className="text-gray-400 text-sm mt-1">{item.product.category.replace('-', ' ')}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-white">₹{Math.round(itemPriceIncludingTax)}</span>
                          {itemOriginalPriceIncludingTax > 0 && (
                            <span className="text-gray-500 text-lg line-through">₹{Math.round(itemOriginalPriceIncludingTax)}</span>
                          )}
                        </div>

                        {/* Features */}
                        {item.product.features && (
                          <div className="flex flex-wrap gap-2">
                            {item.product.features.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start space-y-4">
                        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                          <button
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors duration-200 text-white"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-12 text-center font-bold text-lg text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/20 transition-colors duration-200 text-white"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(productId)}
                          className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-transparent hover:border-red-400/30"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                      <span className="text-gray-400 font-medium">Item Subtotal (incl. taxes)</span>
                      <span className="font-bold text-2xl text-white">₹{Math.round(itemPriceIncludingTax * item.quantity)}</span>
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="xl:w-1/3">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 sticky top-8">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Order Summary
              </h2>
              
              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-purple-400" />
                  Apply Coupon
                </h3>
                
                {appliedCoupon ? (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-400 font-semibold">{appliedCoupon.coupon.code}</p>
                        <p className="text-gray-300 text-sm">
                          {appliedCoupon.coupon.type === 'flat' 
                            ? `₹${appliedCoupon.coupon.value} off` 
                            : `${appliedCoupon.coupon.value}% off`}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-sm"
                    />
                    <button
                      onClick={validateCoupon}
                      disabled={couponLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Subtotal ({itemCount} items)</span>
                  <span className="text-white font-semibold">₹{Math.round(totalIncludingTax)}</span>
                </div>

                {/* Coupon Discount */}
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-400">Coupon Discount</span>
                    <span className="text-green-400 font-semibold">-₹{discountAmount}</span>
                  </div>
                )}

                {/* Shipping Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Shipping</span>
                    {!isShippingFree && (
                      <div className="group relative">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Free shipping on orders ₹399+ (incl. tax)
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`font-semibold ${isShippingFree ? 'text-green-400' : 'text-white'}`}>
                    {isShippingFree ? 'Free' : `₹${Math.round(shippingCost * 1.18)}`}
                  </span>
                </div>

                {/* Free Shipping Progress */}
                {!isShippingFree && !appliedCoupon && (
                  <div className="bg-white/5 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-400 text-sm font-medium">Add ₹{Math.round(SHIPPING_THRESHOLD - totalIncludingTax)} for free shipping</span>
                      <Truck className="w-4 h-4 text-orange-400" />
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((totalIncludingTax / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Savings Row */}
                {totalSavings > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-green-400 flex items-center">
                      You Saved
                      <svg className="w-5 h-5 ml-1 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </span>
                    <span className="font-bold text-green-400">₹{Math.round(totalSavings * 1.18)}</span>
                  </div>
                )}
                
                <div className="border-t border-white/20 pt-6">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-white">₹{Math.round(finalTotalWithShipping)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    Inclusive of all taxes {!isShippingFree && '& shipping'}
                  </div>
                </div>
              </div>

              {showCheckout ? (
                <div className="space-y-6">
                  {/* Login Prompt if not authenticated */}
                  {!isAuthenticated && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                          <LogIn className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">Login Required</h3>
                      <p className="text-gray-300 mb-4 text-sm">
                        Please login to complete your purchase and track your order.
                      </p>
                      <Link
                        to="/login"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Login to Continue</span>
                      </Link>
                    </div>
                  )}

                  {isAuthenticated && (
                    <>
                      <h3 className="text-xl font-bold text-white mb-4">Shipping Address</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                            <div className="relative">
                              <input
                                type="text"
                                name="name"
                                value={shippingAddress.name}
                                onChange={handleAddressChange}
                                minLength={2}
                                maxLength={50}
                                required
                                className="w-full bg-white/10 text-white px-4 py-3 pl-12 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                                placeholder="Enter full name"
                              />
                              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                            <div className="relative">
                              <input
                                type="tel"
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleAddressChange}
                                minLength={10}
                                maxLength={10}
                                required
                                className="w-full bg-white/10 text-white px-4 py-3 pl-12 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                                placeholder="Enter phone number"
                              />
                              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
                          <div className="relative">
                            <input
                              type="text"
                              name="address"
                              value={shippingAddress.address}
                              onChange={handleAddressChange}
                              minLength={5}
                              maxLength={100}
                              required
                              className="w-full bg-white/10 text-white px-4 py-3 pl-12 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                              placeholder="Enter full address"
                            />
                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">City</label>
                            <input
                              type="text"
                              name="city"
                              value={shippingAddress.city}
                              onChange={handleAddressChange}
                              minLength={2}
                              maxLength={50}
                              required
                              className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                              placeholder="City"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">State</label>
                            <input
                              type="text"
                              name="state"
                              value={shippingAddress.state}
                              onChange={handleAddressChange}
                              minLength={2}
                              maxLength={50}
                              required
                              className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                              placeholder="State"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Pincode</label>
                            <input
                              type="text"
                              name="pincode"
                              value={shippingAddress.pincode}
                              onChange={handleAddressChange}
                              minLength={6}
                              maxLength={6}
                              required
                              className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <button
                          onClick={handlePayment}
                          disabled={isProcessing}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? 'Processing...' : `Pay ₹${Math.round(finalTotalWithShipping)}`}
                        </button>
                        
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="w-full border-2 border-white/20 text-white py-3 rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                        >
                          Back to Cart
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Policy Notice for Razorpay compliance */}
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-gray-200 text-sm text-center">
                    By placing your order, you agree to our
                    <Link to="/refund" className="text-blue-400 underline ml-1">
                      Return/Refund Policy
                    </Link>.
                  </div>
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10">Proceed to Checkout</span>
                  </button>
                  
                  <Link
                    to="/shop"
                    className="w-full border-2 border-white/20 text-white py-5 rounded-2xl font-semibold text-lg hover:border-purple-400/50 hover:bg-white/5 transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t border-white/10 mt-8">
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <Truck className="w-5 h-5 text-blue-400" />
                  <span>{isShippingFree ? 'Free Shipping' : `₹${SHIPPING_CHARGE} Shipping`}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400 text-sm">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span>Secure Payment via Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
