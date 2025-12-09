const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', error: null });
});

// Register Logic
router.post('/register', authController.register);

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null, success: null });
});

// Login Logic
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
