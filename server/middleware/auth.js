import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Try to get token from multiple sources for Safari compatibility
  let token = req.cookies.token || 
               req.headers.authorization?.replace('Bearer ', '') ||
               req.session?.token ||
               req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // Store in session as fallback for Safari
    if (req.session && !req.session.userId) {
      req.session.userId = decoded.userId;
      req.session.token = token;
    }
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};