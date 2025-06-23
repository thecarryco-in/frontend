import React, { useState, useEffect } from 'react';
import { Package, MessageSquare, TrendingUp, Users, Eye, Plus, ShoppingBag, IndianRupee } from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
}

interface ContactStats {
  totalContacts: number;
  newContacts: number;
  inProgressContacts: number;
  closedContacts: number;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  packedOrders: number;
  dispatchedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

const AdminDashboard: React.FC = () => {
  const [productStats, setProductStats] = useState<DashboardStats | null>(null);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productResponse, contactResponse, orderResponse] = await Promise.all([
          axios.get('/admin/dashboard'),
          axios.get('/contact/admin/stats'),
          axios.get('/orders/admin/stats')
        ]);
        
        setProductStats(productResponse.data.stats);
        setContactStats(contactResponse.data.stats);
        setOrderStats(orderResponse.data.stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Welcome back, Admin</p>
          <p className="text-white font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      {/* Order Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Order Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white flex items-center">
                  <IndianRupee className="w-6 h-6 mr-1" />
                  {orderStats?.totalRevenue?.toFixed(2) || '0.00'}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-white">{orderStats?.totalOrders || 0}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">Pending Orders</p>
                <p className="text-3xl font-bold text-white">{orderStats?.pendingOrders || 0}</p>
              </div>
              <Package className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-white">{orderStats?.deliveredOrders || 0}</p>
              </div>
              <Eye className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Product Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-white">{productStats?.totalProducts || 0}</p>
              </div>
              <Package className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">In Stock</p>
                <p className="text-3xl font-bold text-white">{productStats?.inStockProducts || 0}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl p-6 border border-red-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Out of Stock</p>
                <p className="text-3xl font-bold text-white">{productStats?.outOfStockProducts || 0}</p>
              </div>
              <Eye className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Featured</p>
                <p className="text-3xl font-bold text-white">{productStats?.featuredProducts || 0}</p>
              </div>
              <Plus className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Stats */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-6 border border-cyan-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Total Messages</p>
                <p className="text-3xl font-bold text-white">{contactStats?.totalContacts || 0}</p>
              </div>
              <MessageSquare className="w-12 h-12 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-400 text-sm font-medium">New</p>
                <p className="text-3xl font-bold text-white">{contactStats?.newContacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">!</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-white">{contactStats?.inProgressContacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Closed</p>
                <p className="text-3xl font-bold text-white">{contactStats?.closedContacts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Add New Product</h3>
                <p className="text-gray-400 text-sm">Create a new product listing</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-6 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">View Messages</h3>
                <p className="text-gray-400 text-sm">Check customer inquiries</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30 hover:border-green-400/50 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Manage Orders</h3>
                <p className="text-gray-400 text-sm">Process customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;