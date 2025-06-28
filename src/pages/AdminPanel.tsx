import React, { useState } from 'react';
import { LayoutDashboard, Package, MessageSquare, ShoppingBag } from 'lucide-react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import ProductManagement from '../components/Admin/ProductManagement';
import ContactManagement from '../components/Admin/ContactManagement';
import OrderManagement from '../components/Admin/OrderManagement';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'products':
        return <ProductManagement />;
      case 'contacts':
        return <ContactManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header with Admin Info */}
        <div className="text-center mb-6 md:mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Manage your store efficiently</p>
        </div>

        {/* Top Tab Navigation */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-2 border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center space-x-2 px-3 py-3 md:px-4 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 ${
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-white/10 min-h-[600px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;