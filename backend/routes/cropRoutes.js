const express = require('express');
const cropController = require('../controllers/cropController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Get all crops
router.get('/', cropController.getAllCrops);

// Get crop by ID
router.get('/:id', cropController.getCropById);

// Get crop recommendations by pincode (now protected)
router.get('/recommendations/:pincode', protect, cropController.getCropRecommendations);

module.exports = router; 