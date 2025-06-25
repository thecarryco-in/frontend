import React, { useState, useEffect } from 'react';
import { User, Package, Heart, Settings, ShoppingBag, Star, Clock, Edit3, Save, X, Eye, Truck, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useWishlist } from '../context/WishlistContext'; // Add this import

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      image: string;
      brand: string;
    };
    productSnapshot: {
      name: string;
      price: number;
      image: string;
      brand: string;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';
  paymentStatus: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  createdAt: string;
  deliveredAt?: string;
}

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user, updateProfile } = useAuth();
  const { itemCount: wishlistCount } = useWishlist(); // Add this line

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/orders/my-orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/20';
      case 'dispatched': return 'text-blue-400 bg-blue-400/20';
      case 'packed': return 'text-purple-400 bg-purple-400/20';
      case 'confirmed': return 'text-cyan-400 bg-cyan-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'dispatched': return <Truck className="w-5 h-5" />;
      case 'packed': return <Package className="w-5 h-5" />;
      case 'confirmed': return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const handleEditStart = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({ name: '', phone: '', avatar: '' });
    setError('');
  };

  const handleEditSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(editData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateProduct = (product: any) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
    setRating(0);
    setComment('');
  };

  const submitReview = async () => {
    if (!selectedProduct || rating === 0 || !comment.trim()) {
      alert('Please provide both rating and comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(`/products/${selectedProduct._id}/review`, {
        rating,
        comment: comment.trim()
      });
      
      alert('Review submitted successfully!');
      setShowRatingModal(false);
      setSelectedProduct(null);
      setRating(0);
      setComment('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Member status calculation and color
  const getMemberStatus = (totalSpent: number) => {
    if (totalSpent >= 10000) return 'Platinum';
    if (totalSpent >= 5000) return 'Gold';
    if (totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'Platinum':
        return 'text-white bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 border border-gray-300';
      case 'Gold':
        return 'text-yellow-500 bg-yellow-100 border border-yellow-400';
      case 'Silver':
        return 'text-gray-400 bg-gray-100 border border-gray-300';
      case 'Bronze':
        return 'text-orange-700 bg-orange-100 border border-orange-400';
      default:
        return 'text-gray-400 bg-gray-100 border border-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  const memberStatus = getMemberStatus(user.totalSpent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
              {/* User Info */}
              <div className="text-center mb-8">
                <div className="relative mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-purple-400/50"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center border-2 border-slate-800">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {user.name}
                </h2>
                <p className="text-gray-400 mb-2">{user.email}</p>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${getMemberStatusColor(memberStatus)}`}>
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold">{memberStatus} Member</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Profile Overview
                  </h1>
                  {!isEditing && (
                    <button
                      onClick={handleEditStart}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {/* Success/Error Messages */}
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                    <p className="text-green-400 text-center">{success}</p>
                  </div>
                )}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                )}
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{orders.length || 0}</p>
                        <p className="text-gray-400 font-medium">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center">
                        <span className="text-green-400 font-bold text-2xl">₹</span>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">
                          ₹{user.totalSpent ? Math.round(user.totalSpent) : 0}
                        </p>
                        <p className="text-gray-400 font-medium">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center">
                        <Heart className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-white">{wishlistCount}</p>
                        <p className="text-gray-400 font-medium">Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                    {isEditing && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded-xl transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          onClick={handleEditSave}
                          disabled={isLoading}
                          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Email Address</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                        <span className="text-white font-medium">{user.email}</span>
                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Verified</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          placeholder="+91 98765 43210"
                          className="w-full bg-white/10 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                        />
                      ) : (
                        <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                          <span className="text-white font-medium">{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3 text-gray-300">Member Since</label>
                      <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
                        <span className="text-white font-medium">{formatDate(user.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  My Orders
                </h1>
                
                {ordersLoading ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">No Orders Yet</h2>
                    <p className="text-gray-400 mb-8 text-lg">Start shopping to see your orders here!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">{order.orderNumber}</h3>
                              <p className="text-gray-400 flex items-center space-x-2 mt-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(order.createdAt)}</span>
                              </p>
                              {order.trackingNumber && (
                                <p className="text-purple-400 text-sm mt-1">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">₹{order.totalAmount.toFixed(2)}</p>
                              <p className="text-gray-400">{order.items.length} items</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <button
                              onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                              className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-xl p-4">
                              <img
                                src={item.productSnapshot.image}
                                alt={item.productSnapshot.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm truncate">{item.productSnapshot.name}</h4>
                                <p className="text-gray-400 text-xs">{item.productSnapshot.brand}</p>
                                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="flex items-center justify-center bg-white/5 rounded-xl p-4">
                              <span className="text-gray-400 text-sm">+{order.items.length - 3} more items</span>
                            </div>
                          )}
                        </div>

                        {/* Rate Products Button - Only show for delivered orders */}
                        {order.status === 'delivered' && (
                          <div className="border-t border-white/10 pt-4">
                            <div className="flex flex-wrap gap-3">
                              {order.items.map((item, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleRateProduct(item.product)}
                                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                                >
                                  <Star className="w-4 h-4" />
                                  <span>Rate {item.productSnapshot.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Expanded Order Details */}
                        {selectedOrder?._id === order._id && (
                          <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-lg font-bold text-white mb-4">Shipping Address</h4>
                                <div className="bg-white/5 rounded-xl p-4">
                                  <p className="text-white font-medium">{order.shippingAddress.name}</p>
                                  <p className="text-gray-400 text-sm mt-1">{order.shippingAddress.address}</p>
                                  <p className="text-gray-400 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                  <p className="text-gray-400 text-sm">Phone: {order.shippingAddress.phone}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-lg font-bold text-white mb-4">Order Summary</h4>
                                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Status:</span>
                                    <span className="text-green-400 font-medium capitalize">{order.paymentStatus}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Total Amount:</span>
                                    <span className="text-white font-bold">₹{order.totalAmount.toFixed(2)}</span>
                                  </div>
                                  {order.deliveredAt && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Delivered On:</span>
                                      <span className="text-green-400">{formatDate(order.deliveredAt)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-bold text-white mb-4">All Items</h4>
                              <div className="space-y-3">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-4 bg-white/5 rounded-xl p-4">
                                    <img
                                      src={item.productSnapshot.image}
                                      alt={item.productSnapshot.name}
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                      <h5 className="text-white font-medium">{item.productSnapshot.name}</h5>
                                      <p className="text-purple-400 text-sm">{item.productSnapshot.brand}</p>
                                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-white font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                      <p className="text-gray-400 text-sm">₹{item.price} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10">
                    <Heart className="w-16 h-16 text-gray-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">Your wishlist is empty</h2>
                  <p className="text-gray-400 mb-8 text-lg">Save your favorite items for later!</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Account Settings
                </h1>
                
                <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-8 text-white">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <h3 className="font-semibold text-white text-lg">Email Notifications</h3>
                        <p className="text-gray-400">Receive updates about your orders and promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <h3 className="font-semibold text-white text-lg">SMS Notifications</h3>
                        <p className="text-gray-400">Get shipping updates and delivery notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <h3 className="font-semibold text-white text-lg">Marketing Communications</h3>
                        <p className="text-gray-400">Receive exclusive offers and product updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-14 h-8 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Rate Product</h3>
              <p className="text-gray-400">{selectedProduct.name}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Rating</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-10 h-10 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={submittingReview || rating === 0 || !comment.trim()}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
