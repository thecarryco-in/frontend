import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['cases', 'tempered-glass', 'chargers', 'accessories', 'work-essentials']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  // Dynamic rating fields - calculated from Review collection
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isTopRated: {
    type: Boolean,
    default: false
  },
  isGift: {
    type: Boolean,
    default: false
  },
  coloredTags: [{
    label: String,
    color: {
      type: String,
      enum: ['green', 'red', 'yellow', 'blue', 'purple', 'pink']
    }
  }]
}, {
  timestamps: true
});

// Method to update rating and review count from Review collection
productSchema.methods.updateRatingFromReviews = async function() {
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    { 
      $match: { 
        product: this._id, 
        status: 'approved' 
      } 
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    this.rating = Math.round(stats[0].averageRating * 10) / 10; // Round to 1 decimal
    this.reviewCount = stats[0].totalReviews;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }

  await this.save();
};

// Index for better search performance
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ isFeatured: 1, inStock: 1 });
productSchema.index({ isNewProduct: 1, inStock: 1 });
productSchema.index({ isGift: 1, inStock: 1 });
productSchema.index({ subcategory: 1, inStock: 1 });
productSchema.index({ rating: -1 });

export default mongoose.model('Product', productSchema);