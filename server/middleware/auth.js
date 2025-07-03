import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Try cookie first
  let token = req.cookies.token;

  // Fallback: check Authorization header (for Safari/iOS/localStorage fallback)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};
