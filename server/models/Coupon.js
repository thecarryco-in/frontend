import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  type: {
    type: String,
    required: true,
    enum: ['flat', 'percentage']
  },
  value: {
    type: Number,
    required: true,
    min: 1
  },
  minCartValue: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  maxUsage: {
    type: Number,
    default: null // null means unlimited
  },
  description: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Index for better performance
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });

export default mongoose.model('Coupon', couponSchema);
