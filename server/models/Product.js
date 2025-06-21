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
    enum: ['cases', 'tempered-glass', 'chargers', 'accessories']
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
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  compatibility: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isNew: {
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
  tags: [{
    type: String,
    trim: true
  }],
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

// Index for better search performance
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ isFeatured: 1, inStock: 1 });

export default mongoose.model('Product', productSchema);