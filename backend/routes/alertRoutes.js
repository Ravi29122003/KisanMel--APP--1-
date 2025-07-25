const express = require('express');
const alertController = require('../controllers/alertController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// GET /api/v1/alerts - Get active alerts for current farmer
router.get('/', alertController.getActiveAlerts);

// POST /api/v1/alerts/generate - Generate new alerts
router.post('/generate', alertController.generateAlerts);

// GET /api/v1/alerts/stats - Get alert statistics
router.get('/stats', alertController.getAlertStats);

// GET /api/v1/alerts/type/:type - Get alerts by type
router.get('/type/:type', alertController.getAlertsByType);

// PATCH /api/v1/alerts/:alertId/read - Mark alert as read
router.patch('/:alertId/read', alertController.markAlertAsRead);

// PATCH /api/v1/alerts/:alertId/dismiss - Dismiss alert
router.patch('/:alertId/dismiss', alertController.dismissAlert);

module.exports = router; 