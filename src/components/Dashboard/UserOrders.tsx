import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, Star, Eye, IndianRupee } from 'lucide-react';
import axios from 'axios';

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

interface UserOrdersProps {
  onOrdersCountChange: (count: number) => void;
}

const UserOrders: React.FC<UserOrdersProps> = ({ onOrdersCountChange }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get('/orders/my-orders');
      setOrders(response.data.orders);
      onOrdersCountChange(response.data.orders.length);
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
      case 'delivered': return <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />;
      case 'dispatched': return <Truck className="w-4 h-4 md:w-5 md:h-5" />;
      case 'packed': return <Package className="w-4 h-4 md:w-5 md:h-5" />;
      case 'confirmed': return <Clock className="w-4 h-4 md:w-5 md:h-5" />;
      default: return <Clock className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  const handleRateProduct = (product: any) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
    setRating(0);
    setComment('');
  };

  const submitReview = async () => {
    if (!selectedProduct || rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(`/products/${selectedProduct._id}/review`, {
        rating,
        comment: comment.trim()
      });
      
      // Add to reviewed products set
      setReviewedProducts(prev => new Set([...prev, selectedProduct._id]));
      
      alert('Review submitted successfully!');
      setShowRatingModal(false);
      setSelectedProduct(null);
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error('Review submission error:', error);
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

  if (ordersLoading) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/10">
          <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">No Orders Yet</h2>
        <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">Start shopping to see your orders here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        My Orders
      </h1>
      
      <div className="space-y-4 md:space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">{order.orderNumber}</h3>
                  <p className="text-gray-400 flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </p>
                  {order.trackingNumber && (
                    <p className="text-purple-400 text-sm mt-1">
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 md:space-x-6">
                <div className="text-right">
                  <p className="text-xl md:text-2xl font-bold text-white flex items-center">
                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                    {order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm">{order.items.length} items</p>
                </div>
                <span className={`px-3 py-2 md:px-4 md:py-2 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)} flex items-center space-x-1`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </span>
                <button
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                  className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {order.items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4">
                  <img
                    src={item.productSnapshot.image}
                    alt={item.productSnapshot.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm truncate">{item.productSnapshot.name}</h4>
                    <p className="text-gray-400 text-xs">{item.productSnapshot.brand}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="flex items-center justify-center bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4">
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
                      disabled={reviewedProducts.has(item.product._id)}
                      className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl font-semibold transition-all duration-300 ${
                        reviewedProducts.has(item.product._id)
                          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <Star className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-sm">
                        {reviewedProducts.has(item.product._id) ? 'Reviewed' : `Rate ${item.productSnapshot.name}`}
                      </span>
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
                    <div className="bg-white/5 rounded-lg md:rounded-xl p-4">
                      <p className="text-white font-medium">{order.shippingAddress.name}</p>
                      <p className="text-gray-400 text-sm mt-1">{order.shippingAddress.address}</p>
                      <p className="text-gray-400 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                      <p className="text-gray-400 text-sm">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Order Summary</h4>
                    <div className="bg-white/5 rounded-lg md:rounded-xl p-4 space-y-2">
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
                      <div key={index} className="flex items-center space-x-4 bg-white/5 rounded-lg md:rounded-xl p-4">
                        <img
                          src={item.productSnapshot.image}
                          alt={item.productSnapshot.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
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

      {/* Rating Modal */}
      {showRatingModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Rate Product</h3>
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
                      className={`w-8 h-8 md:w-10 md:h-10 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={200}
                  className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 border border-white/20 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={submittingReview || rating === 0}
                  className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserOrders;