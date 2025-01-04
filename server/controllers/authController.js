require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwtUtil = require('../utils/jwtutils');
const db = require('../config/db');

exports.registerUser = (req, res) => {
  const { name, email, userType, password, university } = req.body;
  if (!name || !email || !userType || !password || !university) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    const query = 'INSERT INTO users (name, email, usertype, password, university) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [name, email, userType, hashedPassword, university], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to register user' });
      res.status(201).json({ success: 'User registered successfully!' });
    });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const query = 'SELECT * FROM users WHERE email = ?';
  db.execute(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error querying database' });
    if (results.length === 0) return res.status(400).json({ message: 'User not found.' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords' });
      if (!isMatch) return res.status(400).json({ message: 'Invalid password.' });

      const token = jwtUtil.generateToken({ userId: user.id, role: user.usertype });

      res.cookie('authToken', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7*24*60 * 60 * 1000, 
        sameSite: 'strict',
      });

      res.cookie('username', user.name, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7*24*60 * 60 * 1000, 
        sameSite: 'strict',
      });

      res.cookie('uid', user.id, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7*24*60 * 60 * 1000, 
        sameSite: 'strict',
      });

      res.cookie('role', user.usertype, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7*24*60 * 60 * 1000,
        sameSite: 'strict',
      });

      // Assuming `userImageUrl` is a column in your users table
      res.status(200).json({
        success: 'Login successful',
        username: user.name,
        role: user.usertype,
        userImageUrl: user.userImage, // Include the image URL here
      });
    });
  });
};

exports.logoutUser = (req, res) => {
    // Clear the 'authToken' cookie
    res.clearCookie('authToken', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // ensure this matches how cookies were set
      sameSite: 'strict',
      // domain: 'yourdomain.com' // Uncomment and set if needed
    });
  
    // Clear the 'username' cookie
    res.clearCookie('username', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // ensure this matches how cookies were set
      sameSite: 'strict',
      // domain: 'yourdomain.com' // Uncomment and set if needed
    });
  
    res.clearCookie('uid', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // ensure this matches how cookies were set
      sameSite: 'strict',
      // domain: 'yourdomain.com' // Uncomment and set if needed
    });

    // Clear the 'role' cookie
    res.clearCookie('role', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production', // ensure this matches how cookies were set
      sameSite: 'strict',
      // domain: 'yourdomain.com' // Uncomment and set if needed
    });
  
    // Send response after clearing cookies
    res.status(200).json({ message: 'Logged out successfully' });
  };
  