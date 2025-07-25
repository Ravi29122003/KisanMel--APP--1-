const express = require('express');
const recommendController = require('../controllers/recommendController');

const router = express.Router();

// GET /api/recommend-crops/:pincode
router.get('/recommend-crops/:pincode', recommendController.getRecommendedCrops);

module.exports = router; 