const express = require('express');
const cropController = require('../controllers/cropController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All crop routes require authentication
router.use(protect);

// Get crop recommendations
router.post('/recommend', cropController.getRecommendations);

module.exports = router; 