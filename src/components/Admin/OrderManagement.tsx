import React, { useState, useEffect } from 'react';
import { Package, Search, Eye, Truck, Clock, CheckCircle, User, Mail, Phone, MapPin, IndianRupee } from 'lucide-react';
import axios from 'axios';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
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
  notes?: string;
  createdAt: string;
  deliveredAt?: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders/admin/all', {
        params: {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
          limit: 100
        }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  const updateOrderStatus = async () => {
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const response = await axios.put(`/orders/admin/${selectedOrder._id}/status`, updateData);
      
      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? response.data.order : order
      ));
      
      setSelectedOrder(response.data.order);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
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

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || ''
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Order Management
        </h1>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-white font-bold text-xl md:text-2xl">{orders.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md text-white rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-3 pl-10 md:pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Search className="absolute left-3 md:left-4 top-3.5 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="pending" className="bg-gray-800">Pending</option>
          <option value="confirmed" className="bg-gray-800">Confirmed</option>
          <option value="packed" className="bg-gray-800">Packed</option>
          <option value="dispatched" className="bg-gray-800">Dispatched</option>
          <option value="delivered" className="bg-gray-800">Delivered</option>
          <option value="cancelled" className="bg-gray-800">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-pointer"
            onClick={() => handleOrderSelect(order)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-white font-semibold text-base md:text-lg">{order.orderNumber}</h3>
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.replace('-', ' ')}</span>
                  </span>
                  <span className="px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize bg-green-500/20 text-green-400">
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 md:space-x-6 text-gray-400 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{order.user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate">{order.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-bold text-lg md:text-xl flex items-center">
                      <IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                      {order.totalAmount.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-sm">{order.items.length} items</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <span className="text-purple-400 text-sm font-medium">
                      Tracking: {order.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderSelect(order);
                  }}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">No Orders Found</h3>
          <p className="text-gray-400">No orders match your current filters.</p>
        </div>
      )}

      {/* Order Detail Modal - Fixed positioning */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Order Details - {selectedOrder.orderNumber}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition-colors text-xl md:text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Order Information */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <span className="text-white">{selectedOrder.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <span className="text-white break-all">{selectedOrder.user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                  <div className="space-y-2 text-gray-300">
                    <p className="text-white font-medium">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                    <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <img
                          src={item.productSnapshot.image}
                          alt={item.productSnapshot.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{item.productSnapshot.name}</h4>
                          <p className="text-gray-400 text-xs">{item.productSnapshot.brand}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total:</span>
                      <span className="text-xl font-bold text-white flex items-center">
                        <IndianRupee className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                        {selectedOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Order */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Update Order Status</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={updateData.status}
                        onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                        className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending" className="bg-gray-800">Pending</option>
                        <option value="confirmed" className="bg-gray-800">Confirmed</option>
                        <option value="packed" className="bg-gray-800">Packed</option>
                        <option value="dispatched" className="bg-gray-800">Dispatched</option>
                        <option value="delivered" className="bg-gray-800">Delivered</option>
                        <option value="cancelled" className="bg-gray-800">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tracking Number</label>
                      <input
                        type="text"
                        value={updateData.trackingNumber}
                        onChange={(e) => setUpdateData({...updateData, trackingNumber: e.target.value})}
                        className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                        placeholder="Enter tracking number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                      <textarea
                        value={updateData.notes}
                        onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                        rows={3}
                        className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
                        placeholder="Add notes for this order"
                      />
                    </div>

                    <button
                      onClick={updateOrderStatus}
                      disabled={isUpdating}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Updating...' : 'Update Order'}
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Order placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    {selectedOrder.status !== 'pending' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">Payment confirmed</span>
                      </div>
                    )}
                    {selectedOrder.deliveredAt && (
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">Delivered on {new Date(selectedOrder.deliveredAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;