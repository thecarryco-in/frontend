import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subcategory,
      filter,
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

    // Cap pagination limits to prevent DOS
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(parseInt(limit) || 20, 100); // Max 100 per page

    // Build filter object
    const filterObj = { inStock: true }; // Only show in-stock items to users

    if (category) filterObj.category = category;
    if (subcategory) filterObj.subcategory = subcategory;
    if (brand) filterObj.brand = brand;
    if (featured === 'true') filterObj.isFeatured = true;
    if (inStock === 'true') filterObj.inStock = true;
    
    // Handle special filters
    if (filter === 'new') filterObj.isNewProduct = true;
    if (filter === 'gifts') filterObj.isGift = true;
    
    if (minPrice || maxPrice) {
      filterObj.price = {};
      if (minPrice) filterObj.price.$gte = parseFloat(minPrice);
      if (maxPrice) filterObj.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filterObj.name = { $regex: search, $options: 'i' }; // Case-insensitive partial match
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (pageNum - 1) * limitNum;
    const products = await Product.find(filterObj)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filterObj);

    res.status(200).json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
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
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product review (authenticated users only) - STRICT DELIVERY CHECK
router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // CRITICAL: Check if user has purchased this product AND it's delivered
    const userOrder = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered' // MUST be delivered by admin
    });

    if (!userOrder) {
      return res.status(403).json({ 
        message: 'You can only review products from orders that have been delivered' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Get user info
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    // Create new review - automatically approved for delivered orders
    const newReview = new Review({
      user: userId,
      product: productId,
      order: userOrder._id,
      userName: user.name,
      rating: parseInt(rating),
      comment: comment ? comment.trim() : '',
      productSnapshot: {
        name: product.name,
        brand: product.brand,
        category: product.category,
        image: product.image
      },
      status: 'approved' // Auto-approve since order is delivered
    });

    await newReview.save();

    // Update product rating and review count
    await product.updateRatingFromReviews();

    res.status(201).json({ 
      message: 'Review added successfully',
      review: {
        _id: newReview._id,
        rating: newReview.rating,
        comment: newReview.comment,
        userName: newReview.userName,
        createdAt: newReview.createdAt
      },
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
    const { page = 1, limit = 10 } = req.query;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = await Review.find({ 
      product: req.params.id, 
      status: 'approved' 
    })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Review.countDocuments({ 
      product: req.params.id, 
      status: 'approved' 
    });

    res.status(200).json({
      reviews,
      averageRating: product.rating,
      totalReviews: product.reviewCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
