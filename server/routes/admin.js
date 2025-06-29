import express from 'express';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { upload, deleteImage, getPublicIdFromUrl } from '../config/cloudinary.js';

const router = express.Router();

// Upload single image
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Upload multiple images
router.post('/upload-images', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    res.status(200).json({
      message: 'Images uploaded successfully',
      images: uploadedImages
    });
  } catch (error) {
    console.error('Images upload error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
});

// Delete image from Cloudinary
router.delete('/delete-image', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const publicId = getPublicIdFromUrl(imageUrl);
    if (publicId) {
      await deleteImage(publicId);
    }

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

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
      filter.name = { $regex: search, $options: 'i' }; // Case-insensitive partial match
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

// Get product reviews (admin) - READ-ONLY ACCESS
router.get('/reviews', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      rating,
      status = 'approved'
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'order',
          foreignField: '_id',
          as: 'orderDetails'
        }
      },
      {
        $unwind: '$orderDetails'
      }
    ];

    // Add match conditions
    const matchConditions = { status };
    
    if (search) {
      matchConditions.$or = [
        { 'productDetails.name': { $regex: search, $options: 'i' } },
        { 'productDetails.brand': { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      matchConditions['productDetails.category'] = category;
    }
    
    if (rating) {
      matchConditions.rating = { $gte: parseFloat(rating) };
    }

    pipeline.push({ $match: matchConditions });

    // Add sorting
    pipeline.push({ $sort: { createdAt: -1 } });

    // Execute aggregation for total count
    const totalPipeline = [...pipeline, { $count: 'total' }];
    const totalResult = await Review.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Execute main query
    const reviews = await Review.aggregate(pipeline);

    res.status(200).json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// REMOVED: Admin cannot modify review status or delete reviews
// Reviews are automatically approved when users rate delivered orders
// Admins can only view reviews for monitoring purposes

// Create product (admin)
router.post('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category', 'brand', 'image'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Ensure arrays are properly formatted
    if (typeof productData.features === 'string') {
      productData.features = productData.features.split(',').map(f => f.trim()).filter(f => f);
    }
    if (typeof productData.images === 'string') {
      productData.images = productData.images.split(',').map(i => i.trim()).filter(i => i);
    }

    // Parse coloredTags if it's a string
    if (typeof productData.coloredTags === 'string') {
      try {
        productData.coloredTags = JSON.parse(productData.coloredTags);
      } catch (e) {
        productData.coloredTags = [];
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
    const productData = req.body;

    // Ensure arrays are properly formatted
    if (typeof productData.features === 'string') {
      productData.features = productData.features.split(',').map(f => f.trim()).filter(f => f);
    }
    if (typeof productData.images === 'string') {
      productData.images = productData.images.split(',').map(i => i.trim()).filter(i => i);
    }

    // Parse coloredTags if it's a string
    if (typeof productData.coloredTags === 'string') {
      try {
        productData.coloredTags = JSON.parse(productData.coloredTags);
      } catch (e) {
        productData.coloredTags = [];
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete main image from Cloudinary
    if (product.image) {
      const publicId = getPublicIdFromUrl(product.image);
      if (publicId) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error('Error deleting main image:', error);
        }
      }
    }

    // Delete additional images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (error) {
            console.error('Error deleting additional image:', error);
          }
        }
      }
    }

    // Delete all reviews for this product
    await Review.deleteMany({ product: req.params.id });

    await Product.findByIdAndDelete(req.params.id);

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

    // Get products by category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category price inStock createdAt');

    // Review stats
    const totalReviews = await Review.countDocuments();
    const recentReviews = await Review.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    res.status(200).json({
      stats: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        featuredProducts,
        totalReviews,
        recentReviews
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