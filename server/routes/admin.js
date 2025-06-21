import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Admin middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all products (admin)
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      inStock 
    } = req.query;

    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
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
    console.error('Admin get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin)
router.post('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'brand', 'image', 'description'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (admin)
router.put('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ 
      message: 'Product updated successfully', 
      product 
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (admin)
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (admin)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const inStockProducts = await Product.countDocuments({ inStock: true });
    const outOfStockProducts = await Product.countDocuments({ inStock: false });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ isVerified: true, role: 'user' });

    // Get products by category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category price inStock createdAt');

    res.status(200).json({
      stats: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        featuredProducts,
        totalUsers,
        verifiedUsers
      },
      productsByCategory,
      recentProducts
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;