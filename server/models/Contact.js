import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 50
  },
  phone: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 10
  },
  queryType: {
    type: String,
    required: true,
    enum: ['general', 'support', 'product', 'order', 'refund', 'other']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  message: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
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