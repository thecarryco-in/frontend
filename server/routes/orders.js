one must be 10 digits.' });
    }

    // SECURE: Calculate total on server-side
    const orderCalculation = await calculateOrderTotal(items, couponCode);

    // Create Razorpay order with server-calculated total
    const razorpayOrder = await razorpay.orders.create({
      amount: orderCalculation.finalTotal * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Return Razorpay order info with server-calculated totals
    res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      orderCalculation, // Send server-calculated totals to frontend
      items: orderCalculation.validatedItems,
      shippingAddress,
      couponCode: orderCalculation.appliedCoupon?.code || null
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || 'Failed to create order' });
  }
});

// Verify payment and create order in DB
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, items, shippingAddress, couponCode } = req.body;

    // --- Server-side validation ---
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({ message: 'Payment details are required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }

    // Verify Razorpay signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // SECURE: Recalculate total on server-side for verification
    const orderCalculation = await calculateOrderTotal(items, couponCode);

    // Validate items and create order items
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }
      if (!product.inStock) {
        return res.status(400).json({ message: `Product ${product.name} is out of stock.` });
      }
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

    // Apply coupon if used
    if (orderCalculation.appliedCoupon) {
      orderCalculation.appliedCoupon.usageCount += 1;
      await orderCalculation.appliedCoupon.save();
    }

    // Create order in database with server-calculated total
    const order = new Order({
      user: req.userId,
      items: orderItems,
      totalAmount: orderCalculation.finalTotal,
      shippingAddress,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'confirmed',
      paymentStatus: 'completed',
      couponCode: orderCalculation.appliedCoupon?.code || null,
      discountAmount: orderCalculation.discountAmount || 0
    });

    await order.save();

    // Update user total spent
    await User.findByIdAndUpdate(
      req.userId,
      { $inc: { totalSpent: order.totalAmount } }
    );

    // Send confirmation email
    try {
      const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
      await sendOrderConfirmationEmail(
        populatedOrder.user.email,
        populatedOrder.user.name,
        populatedOrder
      );
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    res.status(200).json({
      message: 'Payment verified and order created successfully',
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message || 'Payment verification failed' });
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