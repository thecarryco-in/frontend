// SECURE: Session-based authentication middleware
export const authenticateToken = (req, res, next) => {
  // Check if user has valid session
  if (!req.session?.userId || !req.session?.isAuthenticated) {
    return res.status(401).json({ message: 'Access denied. Please login.' });
  }

  // Add user ID to request for downstream middleware
  req.userId = req.session.userId;
  
  next();
};