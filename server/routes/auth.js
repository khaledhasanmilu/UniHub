const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const verifyTokenMiddleware = require('../middleware/verifyToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/verify', verifyTokenMiddleware, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});
module.exports = router;
