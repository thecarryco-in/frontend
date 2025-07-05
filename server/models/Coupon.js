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
  validityDays: {
    type: Number,
    required: true,
    min: 1,
    max: 365
  },
  expiresAt: {
    type: Date,
    required: true
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

// Auto-set expiry date based on validity days
couponSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('validityDays')) {
    this.expiresAt = new Date(Date.now() + this.validityDays * 24 * 60 * 60 * 1000);
  }
  next();
});

// Index for better performance
couponSchema.index({ code: 1 });
couponSchema.index({ expiresAt: 1 });
couponSchema.index({ isActive: 1 });

export default mongoose.model('Coupon', couponSchema);
