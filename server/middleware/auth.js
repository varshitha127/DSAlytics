const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token (bypassed for development)
exports.authenticateToken = (req, res, next) => {
  req.userId = 'fake-user-id';
  req.user = { _id: 'fake-user-id', name: 'Any User', email: 'any@email.com', role: 'user', isActive: true };
  next();
};

// Optional authentication middleware (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.userId = decoded.userId;
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Admin authorization middleware
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Access denied. Authentication required.' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access denied. Admin privileges required.' 
    });
  }

  next();
}; 