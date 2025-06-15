const express = require('express');
const userController = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', userController.signup);
router.post('/verify-otp', userController.verifyOTP);
router.post('/login', userController.login);

// Protected routes
router.use(protect); // All routes after this middleware require authentication
router.get('/me', userController.getMe);
router.patch('/update-profile', userController.updateProfile);

module.exports = router; 