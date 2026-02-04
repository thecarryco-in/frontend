import express from 'express';
import Coupon from '../models/Coupon.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Validate coupon (public route for cart)
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code || !cartTotal) {
      return res.status(400).json({ message: 'Coupon code and cart total are required' });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    // Check minimum cart value
    if (cartTotal < coupon.minCartValue) {
      return res.status(400).json({ 
        message: `Minimum cart value of ₹${coupon.minCartValue} required for this coupon` 
      });
    }

    // Check usage limit
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, cartTotal);
    } else if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.value) / 100;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description
      },
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(cartTotal - discountAmount)
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all coupons
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      type,
      status 
    } = req.query;

    // Cap pagination limits
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(parseInt(limit) || 20, 100);

    const filter = {};
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) filter.type = type;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const skip = (pageNum - 1) * limitNum;
    const coupons = await Coupon.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Coupon.countDocuments(filter);

    res.status(200).json({
      coupons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create coupon
router.post('/admin/create', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { code, type, value, minCartValue, maxUsage, description } = req.body;

    // Validation
    if (!code || !type || !value) {
      return res.status(400).json({ message: 'Code, type, and value are required' });
    }

    if (!['flat', 'percentage'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "flat" or "percentage"' });
    }

    if (type === 'percentage' && value > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' });
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      minCartValue: minCartValue || 0,
      maxUsage: maxUsage || null,
      description
    });

    await coupon.save();

    res.status(201).json({ 
      message: 'Coupon created successfully', 
      coupon 
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update coupon
router.put('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isActive, maxUsage, description } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { 
        isActive,
        maxUsage: maxUsage || null,
        description
      },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ 
      message: 'Coupon updated successfully', 
      coupon 
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete coupon
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get coupon statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const inactiveCoupons = await Coupon.countDocuments({ isActive: false });

    // Most used coupons
    const mostUsedCoupons = await Coupon.find()
      .sort({ usageCount: -1 })
      .limit(5)
      .select('code usageCount type value');

    // Coupons by type
    const couponsByType = await Coupon.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      stats: {
        totalCoupons,
        activeCoupons,
        inactiveCoupons
      },
      mostUsedCoupons,
      couponsByType
    });
  } catch (error) {
    console.error('Coupon stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
