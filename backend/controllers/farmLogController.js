const FarmLog = require('../models/farmLog');
const Farmer = require('../models/farmerModel');

// Create a new farm log entry
exports.createLogEntry = async (req, res) => {
    try {
        const logEntry = new FarmLog({
            farmerId: req.user.id,
            ...req.body
        });

        await logEntry.save();

        // If it's a manual observation with high priority, notify support team
        if (logEntry.logType === 'manual_observation' && 
            logEntry.observation?.notes && 
            (logEntry.observation.notes.toLowerCase().includes('problem') || 
             logEntry.observation.notes.toLowerCase().includes('disease') ||
             logEntry.observation.notes.toLowerCase().includes('pest') ||
             logEntry.observation.notes.toLowerCase().includes('yellow') ||
             logEntry.observation.notes.toLowerCase().includes('issue'))) {
            
            logEntry.supportStatus.sent = true;
            logEntry.supportStatus.sentAt = new Date();
            logEntry.supportStatus.priority = 'high';
            await logEntry.save();

            // Here you would integrate with your support system
            // For now, we'll just log it
            console.log(`🚨 Support Alert: New observation from farmer ${req.user.id}:`, logEntry.observation.notes);
        }

        await logEntry.populate('farmerId', 'name mobileNumber');

        res.status(201).json({
            status: 'success',
            data: {
                logEntry
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get farm logs for a farmer
exports.getFarmLogs = async (req, res) => {
    try {
        const { cropName, logType, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const filter = { farmerId: req.user.id };
        if (cropName) filter.cropName = cropName;
        if (logType) filter.logType = logType;

        const logs = await FarmLog.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('farmerId', 'name mobileNumber');

        const total = await FarmLog.countDocuments(filter);

        res.status(200).json({
            status: 'success',
            data: {
                logs,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Log task completion automatically
exports.logTaskCompletion = async (req, res) => {
    try {
        const { taskId, taskName, stageName, cropName, priority, estimatedTime } = req.body;

        const logEntry = new FarmLog({
            farmerId: req.user.id,
            cropName,
            logType: 'task_completion',
            title: `${taskName} completed`,
            description: `Task "${taskName}" was completed successfully in ${stageName} stage.`,
            taskDetails: {
                taskId,
                stageName,
                priority,
                estimatedTime
            }
        });

        await logEntry.save();
        await logEntry.populate('farmerId', 'name mobileNumber');

        res.status(201).json({
            status: 'success',
            data: {
                logEntry
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get today's log summary
exports.getTodaysSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const logs = await FarmLog.find({
            farmerId: req.user.id,
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        }).sort({ createdAt: -1 });

        const summary = {
            totalEntries: logs.length,
            tasksCompleted: logs.filter(log => log.logType === 'task_completion').length,
            observations: logs.filter(log => log.logType === 'manual_observation').length,
            pendingSupport: logs.filter(log => log.supportStatus.sent && !log.supportStatus.responded).length
        };

        res.status(200).json({
            status: 'success',
            data: {
                summary,
                logs
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update support status
exports.updateSupportStatus = async (req, res) => {
    try {
        const { logId } = req.params;
        const { responded, response } = req.body;

        const logEntry = await FarmLog.findOneAndUpdate(
            { _id: logId, farmerId: req.user.id },
            {
                'supportStatus.responded': responded,
                'supportStatus.respondedAt': responded ? new Date() : undefined,
                'supportStatus.response': response
            },
            { new: true }
        );

        if (!logEntry) {
            return res.status(404).json({
                status: 'fail',
                message: 'Log entry not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                logEntry
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 