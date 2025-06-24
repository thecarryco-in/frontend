import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { sendOrderConfirmationEmail, sendOrderDeliveredEmail } from '../services/emailService.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    console.log('Received order data:', { items, shippingAddress, totalAmount });

    // Validate items and check stock
    const productIds = items.map(item => item.productId);
    console.log('Product IDs:', productIds);

    const products = await Product.find({ _id: { $in: productIds } });
    console.log('Found products:', products.length);

    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      
      if (!product) {
        console.log('Product not found:', item.productId);
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        product: product._id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          category: product.category
        },
        quantity: item.quantity,
        price: product.price
      });
    }

    console.log('Calculated total:', calculatedTotal);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(calculatedTotal * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    console.log('Razorpay order created:', razorpayOrder.id);

    // Create order in database
    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();
    console.log('Order saved to database:', order._id);

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Verify payment and confirm order
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order
    const order = await Order.findById(orderId).populate('user').populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paymentStatus = 'completed';
    order.status = 'confirmed';

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { 
          $inc: { stockQuantity: -item.quantity }
        }
      );
    }

    // Update user total spent
    await User.findByIdAndUpdate(
      order.user._id,
      { $inc: { totalSpent: order.totalAmount } }
    );

    await order.save();

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order.user.email, order.user.name, order);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the order if email fails
    }

    res.status(200).json({
      message: 'Payment verified successfully',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ user: req.userId });

    res.status(200).json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search 
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Admin: Update order status
router.put('/admin/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const order = await Order.findById(req.params.orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    order.status = status;
    
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send delivery email if status changed to delivered
    if (oldStatus !== 'delivered' && status === 'delivered') {
      try {
        await sendOrderDeliveredEmail(order.user.email, order.user.name, order);
      } catch (emailError) {
        console.error('Delivery email error:', emailError);
        // Don't fail the status update if email fails
      }
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Admin: Get order statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const packedOrders = await Order.countDocuments({ status: 'packed' });
    const dispatchedOrders = await Order.countDocuments({ status: 'dispatched' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    // Revenue calculation
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalAmount createdAt user');

    res.status(200).json({
      stats: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        packedOrders,
        dispatchedOrders,
        deliveredOrders,
        totalRevenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('Order stats error:', error);
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
});

export default router;