const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Register route (for future registration feature)
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
