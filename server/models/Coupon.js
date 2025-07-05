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
couponSchema.pre('validate', function(next) {
  // Always coerce validityDays to a number
  this.validityDays = Number(this.validityDays);
  if (!this.validityDays || isNaN(this.validityDays)) {
    return next(new Error('validityDays must be a valid number'));
  }
  // Only set expiresAt if not already set, or always set it for consistency
  this.expiresAt = new Date(Date.now() + this.validityDays * 24 * 60 * 60 * 1000);
  next();
});

// Index for better performance
// Remove duplicate index warning by commenting out code index (already unique in schema)
// couponSchema.index({ code: 1 });
couponSchema.index({ expiresAt: 1 });
couponSchema.index({ isActive: 1 });

export default mongoose.model('Coupon', couponSchema);
