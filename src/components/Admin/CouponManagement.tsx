import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Tag, Percent, IndianRupee, Users, TrendingUp } from 'lucide-react';
import axios from 'axios';

// Updated Coupon interface: removed validityDays, expiresAt
interface Coupon {
  _id: string;
  code: string;
  type: 'flat' | 'percentage';
  value: number;
  minCartValue: number;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  description?: string;
  createdAt: string;
}

const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState<any>(null);

  // Remove validityDays from formData
  const [formData, setFormData] = useState({
    code: '',
    type: 'flat' as 'flat' | 'percentage',
    value: '',
    minCartValue: '',
    maxUsage: '',
    description: ''
  });

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/coupons/admin/all', {
        params: {
          search: searchTerm || undefined,
          type: typeFilter || undefined,
          status: statusFilter || undefined,
          limit: 100 // Server enforces max 100
        }
      });
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/coupons/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCoupons();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, typeFilter, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation for required fields and correct types
    if (!formData.code.trim()) {
      alert('Coupon code is required.');
      return;
    }
    if (!formData.type || !['flat', 'percentage'].includes(formData.type)) {
      alert('Discount type is required and must be flat or percentage.');
      return;
    }
    if (!formData.value || isNaN(Number(formData.value)) || Number(formData.value) < 1) {
      alert('Discount value is required and must be a positive number.');
      return;
    }
    if (formData.type === 'percentage' && Number(formData.value) > 100) {
      alert('Percentage discount cannot exceed 100%.');
      return;
    }
    if (formData.minCartValue && (isNaN(Number(formData.minCartValue)) || Number(formData.minCartValue) < 0)) {
      alert('Min cart value must be 0 or greater.');
      return;
    }
    if (formData.maxUsage && (isNaN(Number(formData.maxUsage)) || Number(formData.maxUsage) < 1)) {
      alert('Max usage must be a positive number.');
      return;
    }

    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        minCartValue: parseFloat(formData.minCartValue) || 0,
        maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null
      };

      if (editingCoupon) {
        await axios.put(`/coupons/admin/${editingCoupon._id}`, {
          isActive: editingCoupon.isActive,
          description: formData.description,
          maxUsage: formData.maxUsage ? parseInt(formData.maxUsage) : null
        });
      } else {
        await axios.post('/coupons/admin/create', payload);
      }

      fetchCoupons();
      fetchStats();
      handleCloseModal();
      alert(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await axios.delete(`/coupons/admin/${couponId}`);
      fetchCoupons();
      fetchStats();
      alert('Coupon deleted successfully!');
    } catch (error) {
      alert('Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await axios.put(`/coupons/admin/${coupon._id}`, {
        isActive: !coupon.isActive,
        description: coupon.description,
        maxUsage: coupon.maxUsage
      });
      fetchCoupons();
      fetchStats();
    } catch (error) {
      alert('Failed to update coupon status');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'flat',
      value: '',
      minCartValue: '',
      maxUsage: '',
      description: ''
    });
  };

  // Status color and text: only Active/Inactive
  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.isActive) return 'text-gray-400 bg-gray-400/20';
    return 'text-green-400 bg-green-400/20';
  };

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.isActive) return 'Inactive';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading coupons...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Discount Coupons
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add Coupon</span>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Coupons</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.stats.totalCoupons}</p>
              </div>
              <Tag className="w-8 h-8 md:w-12 md:h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Active Coupons</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.stats.activeCoupons}</p>
              </div>
              <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Inactive</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.stats.inactiveCoupons}</p>
              </div>
              <Eye className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md text-white rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-3 pl-10 md:pl-12 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <Search className="absolute left-3 md:left-4 top-3.5 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Types</option>
          <option value="flat" className="bg-gray-800">Flat Discount</option>
          <option value="percentage" className="bg-gray-800">Percentage Discount</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="active" className="bg-gray-800">Active</option>
          <option value="inactive" className="bg-gray-800">Inactive</option>
        </select>
      </div>

      {/* Coupons List */}
      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div 
            key={coupon._id} 
            className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-white font-bold text-lg md:text-xl">{coupon.code}</h3>
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(coupon)}`}>
                    {getStatusText(coupon)}
                  </span>
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold capitalize ${
                    coupon.type === 'flat' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {coupon.type === 'flat' ? 'Flat' : 'Percentage'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Discount:</span>
                    <p className="text-white font-semibold">
                      {coupon.type === 'flat' ? `₹${coupon.value}` : `${coupon.value}%`}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Min Cart:</span>
                    <p className="text-white font-semibold">₹{coupon.minCartValue}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Usage:</span>
                    <p className="text-white font-semibold">
                      {coupon.usageCount}{coupon.maxUsage ? `/${coupon.maxUsage}` : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <p className="text-white font-semibold">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {coupon.description && (
                  <p className="text-gray-300 text-sm mt-3">{coupon.description}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleStatus(coupon)}
                  className={`p-2 rounded-lg transition-colors ${
                    coupon.isActive 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="text-center py-12 md:py-20">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">No Coupons Found</h3>
          <p className="text-gray-400">No coupons match your current filters.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors text-xl md:text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    placeholder="SAVE20"
                    required
                    maxLength={20}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'flat' | 'percentage'})}
                    className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="flat" className="bg-gray-800">Flat Amount (₹)</option>
                    <option value="percentage" className="bg-gray-800">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Discount Value {formData.type === 'flat' ? '(₹)' : '(%)'}
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    placeholder={formData.type === 'flat' ? '100' : '10'}
                    min="1"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({...formData, minCartValue: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Max Usage (Optional)</label>
                  <input
                    type="number"
                    value={formData.maxUsage}
                    onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                    className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full bg-white/10 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 resize-none"
                  placeholder="Special discount for new customers..."
                  maxLength={200}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-white/20 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
