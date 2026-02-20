const express = require('express');
const marketController = require('../controllers/marketController');

const router = express.Router();

// Get market offers for dashboard
router.get('/dashboard', marketController.getMarketOffers);

// Get latest contracts for saved crops (one per crop)
router.post('/contracts', marketController.getLatestCropContracts);

// Get all contracts for a specific crop (with pagination)
router.post('/contracts/all', marketController.getAllContractsForCrop);

// Search for latest contract by crop name
router.post('/search', marketController.searchLatestContract);

// Get contract details by ID
router.get('/contracts/:id', marketController.getContractById);

module.exports = router; 