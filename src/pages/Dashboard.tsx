import React, { useState, useEffect } from 'react';
import { User, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import UserProfile from '../components/Dashboard/UserProfile';
import UserStats from '../components/Dashboard/UserStats';
import UserOrders from '../components/Dashboard/UserOrders';
import UserWishlist from '../components/Dashboard/UserWishlist';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [ordersCount, setOrdersCount] = useState(0);
  const { user } = useAuth();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const getMemberStatus = (totalSpent: number = 0) => {
    if (totalSpent >= 10000) return 'Platinum';
    if (totalSpent >= 5000) return 'Gold';
    if (totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case 'Platinum':
        return 'text-white';
      case 'Gold':
        return 'text-yellow-400';
      case 'Silver':
        return 'text-gray-400';
      case 'Bronze':
        return 'text-orange-700';
      default:
        return 'text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  const memberStatus = getMemberStatus(user.totalSpent);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
              {/* User Info */}
              <div className="text-center mb-6 md:mb-8">
                <div className="relative mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto border-4 border-purple-400/50"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center border-2 border-slate-800">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {user.name}
                </h2>
                <p className="text-gray-400 mb-2 text-sm md:text-base">{user.email}</p>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30`}>
                  <span className={`text-xs md:text-sm font-semibold ${getMemberStatusColor(memberStatus)}`}>{memberStatus} Member</span>
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
                      className={`w-full flex items-center space-x-3 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="font-medium text-sm md:text-base">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === 'profile' && (
              <div className="space-y-6 md:space-y-8">
                <UserStats ordersCount={ordersCount} />
                <UserProfile />
              </div>
            )}

            {activeTab === 'orders' && (
              <UserOrders onOrdersCountChange={setOrdersCount} />
            )}

            {activeTab === 'wishlist' && (
              <UserWishlist />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;