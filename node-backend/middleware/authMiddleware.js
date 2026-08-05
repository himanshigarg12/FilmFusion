// authMiddleware.js - Protects private routes
// Think of this as a security guard 💂
// It checks if user has valid token before letting them in

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    // React sends token like: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied! Please login first.' 
      });
    }

    // Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add userId to request so controllers can use it
    req.userId = decoded.userId;

    // Move to next function (controller)
    next();

  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid or expired token! Please login again.' 
    });
  }
};

module.exports = authMiddleware;