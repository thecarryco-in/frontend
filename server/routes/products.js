import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';
import { reviewLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      search, 
      inStock, 
      featured, 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { inStock: true }; // Only show in-stock items to users

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (featured === 'true') filter.isFeatured = true;
    if (inStock === 'true') filter.inStock = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive partial match
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products (public)
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      inStock: true 
    }).sort({ createdAt: -1 }).limit(6);
    
    res.status(200).json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      inStock: true 
    }).populate('reviews.user', 'name avatar');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product review (authenticated users only)
router.post('/:id/review', reviewLimiter, authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has purchased this product
    const userOrder = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered'
    });

    if (!userOrder) {
      return res.status(403).json({ message: 'You can only review products you have purchased and received' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = product.reviews.find(review => review.user.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Get user info
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    // Add review
    const newReview = {
      user: userId,
      userName: user.name,
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    product.calculateAverageRating();
    await product.save();

    res.status(201).json({ 
      message: 'Review added successfully',
      review: newReview,
      averageRating: product.rating,
      totalReviews: product.reviewCount
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product reviews (public)
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar')
      .select('reviews rating reviewCount');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      reviews: product.reviews,
      averageRating: product.rating,
      totalReviews: product.reviewCount
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
