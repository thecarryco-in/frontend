import React from 'react';
import { ShoppingBag, Heart, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

interface UserStatsProps {
  ordersCount: number;
}

const UserStats: React.FC<UserStatsProps> = ({ ordersCount }) => {
  const { user } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl md:rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white">{ordersCount || 0}</p>
            <p className="text-gray-400 font-medium">Total Orders</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl md:rounded-2xl flex items-center justify-center">
            <IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white">
              ₹{user.totalSpent ? Math.round(user.totalSpent) : 0}
            </p>
            <p className="text-gray-400 font-medium">Total Spent</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white">{wishlistCount}</p>
            <p className="text-gray-400 font-medium">Wishlist Items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;