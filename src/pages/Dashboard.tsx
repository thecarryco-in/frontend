import React, { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, ShoppingBag, Star, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 1247.50
  };

  const mockOrders = [
    {
      id: '#ORD-001',
      date: '2025-01-15',
      status: 'delivered',
      total: 89.99,
      items: 2
    },
    {
      id: '#ORD-002',
      date: '2025-01-10',
      status: 'shipped',
      total: 149.98,
      items: 3
    },
    {
      id: '#ORD-003',
      date: '2025-01-05',
      status: 'processing',
      total: 79.99,
      items: 1
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/20';
      case 'shipped': return 'text-blue-400 bg-blue-400/20';
      case 'processing': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              {/* User Info */}
              <div className="text-center mb-8">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-700"
                />
                <h2 className="text-xl font-bold">{mockUser.name}</h2>
                <p className="text-gray-400">{mockUser.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all duration-200">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Profile</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{mockUser.totalOrders}</p>
                        <p className="text-gray-400 text-sm">Total Orders</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400 font-bold text-lg">$</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">${mockUser.totalSpent}</p>
                        <p className="text-gray-400 text-sm">Total Spent</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Star className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">Gold</p>
                        <p className="text-gray-400 text-sm">Member Status</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={mockUser.name}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={mockUser.email}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Join Date</label>
                      <input
                        type="text"
                        value={mockUser.joinDate}
                        disabled
                        className="w-full bg-gray-700 text-gray-400 px-4 py-3 rounded-lg border border-gray-600"
                      />
                    </div>
                  </div>
                  <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Order History</h1>
                
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{order.id}</h3>
                            <p className="text-gray-400 text-sm flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{order.date}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold">${order.total}</p>
                            <p className="text-gray-400 text-sm">{order.items} items</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Wishlist</h1>
                <div className="text-center py-20">
                  <Heart className="w-24 h-24 text-gray-600 mx-auto mb-8" />
                  <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
                  <p className="text-gray-400 mb-8">Save your favorite items for later!</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <h2 className="text-xl font-bold mb-6">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-gray-400 text-sm">Get shipping updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;