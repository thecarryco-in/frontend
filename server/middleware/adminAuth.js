// Admin authentication middleware
export const requireAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if the authenticated user's email is the admin email
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user email matches admin email
    if (user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Add admin flag to request
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};