import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  queryType: {
    type: String,
    required: true,
    enum: ['general', 'support', 'product', 'order', 'refund', 'other']
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Index for better search performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ queryType: 1, createdAt: -1 });

export default mongoose.model('Contact', contactSchema);
