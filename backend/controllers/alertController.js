const smartAlertService = require('../services/smartAlertService');
const Alert = require('../models/alert');

// Get active alerts for the current farmer
exports.getActiveAlerts = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const alerts = await smartAlertService.getActiveAlerts(farmerId);
        
        res.status(200).json({
            status: 'success',
            results: alerts.length,
            data: {
                alerts
            }
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch alerts',
            details: error.message
        });
    }
};

// Generate new alerts for the current farmer
exports.generateAlerts = async (req, res) => {
    try {
        const farmerId = req.user.id;
        
        // First cleanup expired alerts
        await smartAlertService.cleanupExpiredAlerts();
        
        // Generate new alerts
        const newAlerts = await smartAlertService.generateAlertsForFarmer(farmerId);
        
        res.status(201).json({
            status: 'success',
            results: newAlerts.length,
            data: {
                alerts: newAlerts
            }
        });
    } catch (error) {
        console.error('Error generating alerts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to generate alerts',
            details: error.message
        });
    }
};

// Mark an alert as read
exports.markAlertAsRead = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { alertId } = req.params;
        
        const updatedAlert = await smartAlertService.markAlertAsRead(alertId, farmerId);
        
        if (!updatedAlert) {
            return res.status(404).json({
                status: 'error',
                message: 'Alert not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                alert: updatedAlert
            }
        });
    } catch (error) {
        console.error('Error marking alert as read:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to mark alert as read',
            details: error.message
        });
    }
};

// Get alert statistics
exports.getAlertStats = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const now = new Date();
        
        // Get counts for different alert statuses
        const [totalActive, unread, urgent, weatherAlerts, pestAlerts] = await Promise.all([
            Alert.countDocuments({ 
                farmerId, 
                isActive: true, 
                validUntil: { $gt: now } 
            }),
            Alert.countDocuments({ 
                farmerId, 
                isActive: true, 
                isRead: false, 
                validUntil: { $gt: now } 
            }),
            Alert.countDocuments({ 
                farmerId, 
                isActive: true, 
                priority: 'urgent', 
                validUntil: { $gt: now } 
            }),
            Alert.countDocuments({ 
                farmerId, 
                isActive: true, 
                alertType: 'weather', 
                validUntil: { $gt: now } 
            }),
            Alert.countDocuments({ 
                farmerId, 
                isActive: true, 
                alertType: 'pest_disease', 
                validUntil: { $gt: now } 
            })
        ]);
        
        res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalActive,
                    unread,
                    urgent,
                    byType: {
                        weather: weatherAlerts,
                        pest_disease: pestAlerts
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching alert stats:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch alert statistics',
            details: error.message
        });
    }
};

// Dismiss an alert (mark as inactive)
exports.dismissAlert = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { alertId } = req.params;
        
        const updatedAlert = await Alert.findOneAndUpdate(
            { _id: alertId, farmerId },
            { isActive: false },
            { new: true }
        );
        
        if (!updatedAlert) {
            return res.status(404).json({
                status: 'error',
                message: 'Alert not found'
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                alert: updatedAlert
            }
        });
    } catch (error) {
        console.error('Error dismissing alert:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to dismiss alert',
            details: error.message
        });
    }
};

// Get alerts by type
exports.getAlertsByType = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { type } = req.params;
        const now = new Date();
        
        const alerts = await Alert.find({
            farmerId,
            alertType: type,
            isActive: true,
            validUntil: { $gt: now }
        }).sort({ priority: -1, createdAt: -1 });
        
        res.status(200).json({
            status: 'success',
            results: alerts.length,
            data: {
                alerts
            }
        });
    } catch (error) {
        console.error('Error fetching alerts by type:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch alerts by type',
            details: error.message
        });
    }
}; 