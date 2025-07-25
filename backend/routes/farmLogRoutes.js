const express = require('express');
const farmLogController = require('../controllers/farmLogController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Farm log routes
router
    .route('/')
    .get(farmLogController.getFarmLogs)
    .post(farmLogController.createLogEntry);

router
    .route('/task-completion')
    .post(farmLogController.logTaskCompletion);

router
    .route('/today-summary')
    .get(farmLogController.getTodaysSummary);

router
    .route('/:logId/support-status')
    .patch(farmLogController.updateSupportStatus);

module.exports = router; 