import express from 'express';
import Gallery from '../models/Gallery.js';

const router = express.Router();

// Get gallery images by category (public route)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['shop', 'new-arrivals', 'gifts', 'work-essentials'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const images = await Gallery.find({ category }).sort({ order: 1 });
    
    console.log(`Gallery images for ${category}:`, images.length);
    
    res.status(200).json({ images });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;