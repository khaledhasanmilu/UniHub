const User = require('../models/User'); // Assuming you're using a User model
const bcrypt = require('bcrypt');
const passport = require('passport');  // If using Passport for authentication

// Render the login page
exports.getLogin = (req, res) => {
    res.render('login');
};

// Handle login form submission
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        // Set up session or token here
        req.session.user = user;
        res.redirect('/dashboard'); // Redirect to a dashboard after successful login
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

// Render the registration page (for future feature)
exports.getRegister = (req, res) => {
    res.render('register');
};

// Handle registration (for future feature)
exports.postRegister = async (req, res) => {
    // Registration logic
};

// Logout user
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
