const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth Middleware - Authorization header:', authHeader);

  if (!authHeader) {
    console.log('Auth Middleware - No authorization header found');
    return res.status(401).json({ message: 'Authorization denied, no token provided.' });
  }

  try {
    if (!authHeader.startsWith('Bearer ')) {
      console.log('Auth Middleware - Invalid token format');
      return res.status(401).json({ message: 'Token format is "Bearer <token>"' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Auth Middleware - Extracted token:', token);

    if (!token) {
      console.log('Auth Middleware - Token is missing after extraction');
      return res.status(401).json({ message: 'Authorization denied, token is missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); 
    console.log('Auth Middleware - Decoded token:', decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log('Auth Middleware - Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
}; 