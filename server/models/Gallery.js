import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['shop', 'new-arrivals', 'gifts', 'work-essentials']
  },
  order: {
    type: Number,
    default: 0
  },
  publicId: {
    type: String, // Cloudinary public ID for deletion
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
gallerySchema.index({ category: 1, order: 1 });

export default mongoose.model('Gallery', gallerySchema);