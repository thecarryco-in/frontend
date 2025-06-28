import React from 'react';
import { Heart } from 'lucide-react';

const UserWishlist: React.FC = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
        My Wishlist
      </h1>
      <div className="text-center py-12 md:py-20">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 backdrop-blur-sm border border-white/10">
          <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">Save your favorite items for later!</p>
      </div>
    </div>
  );
};

export default UserWishlist;