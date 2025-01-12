const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyTokenMiddleware = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Please log in.' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request object for use in subsequent routes
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  });
};

module.exports = verifyTokenMiddleware;
