import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

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
      filter.$text = { $search: search };
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

export default router;