import React, { useState } from 'react';
import { Edit3, Save, X, User, Mail, Phone, Calendar, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  if (!user) return null;

  const memberStatus = getMemberStatus(user.totalSpent);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Profile Overview
        </h1>
        {!isEditing && (
          <button
            onClick={handleEditStart}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl md:rounded-2xl p-4">
          <p className="text-green-400 text-center">{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl p-4">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-white">Personal Information</h2>
          {isEditing && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEditCancel}
                className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 text-gray-400 hover:text-white border border-gray-600 rounded-lg md:rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleEditSave}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg md:rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                minLength={2}
                maxLength={20}
                className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <div className="bg-white/5 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10">
                <span className="text-white font-medium">{user.name}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Email Address</label>
            <div className="bg-white/5 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10">
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
                placeholder="9876543210"
                minLength={2}
                maxLength={20}
                className="w-full bg-white/10 backdrop-blur-md text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              />
            ) : (
              <div className="bg-white/5 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10">
                <span className="text-white font-medium">{user.phone || 'Not provided'}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Member Since</label>
            <div className="bg-white/5 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10">
              <span className="text-white font-medium">{formatDate(user.joinDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
