require('dotenv').config(); // Load environment variables

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your_secret_keey'; // Use a default key as a fallback

// Generate a JWT token with the given payload and options
exports.generateToken = (payload) =>
  jwt.sign(payload, secretKey, { expiresIn: '7d' });

// Verify the provided JWT token
exports.verifyToken = (token) =>
  jwt.verify(token, secretKey);
