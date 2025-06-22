import React, { useState } from 'react';
import { LayoutDashboard, Package, MessageSquare, Settings, Users, BarChart3 } from 'lucide-react';
import AdminDashboard from '../components/Admin/AdminDashboard';
import ProductManagement from '../components/Admin/ProductManagement';
import ContactManagement from '../components/Admin/ContactManagement';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'contacts', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'contacts':
        return <ContactManagement />;
      case 'analytics':
        return (
          <div className="text-center py-20">
            <BarChart3 className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Analytics Coming Soon</h3>
            <p className="text-gray-400">Advanced analytics and reporting features will be available soon.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-20">
            <Settings className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Settings Coming Soon</h3>
            <p className="text-gray-400">Admin settings and configuration options will be available soon.</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 sticky top-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-gray-400 text-sm">Manage your store</p>
              </div>

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
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10 min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;