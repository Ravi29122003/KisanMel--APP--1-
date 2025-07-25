const mongoose = require('mongoose');

const farmLogSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    logType: {
        type: String,
        enum: ['task_completion', 'manual_observation', 'system_alert'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // For task completions
    taskDetails: {
        taskId: String,
        stageName: String,
        priority: String,
        estimatedTime: String
    },
    // For manual observations
    observation: {
        notes: String,
        images: [{
            url: String,
            filename: String,
            uploadedAt: Date
        }],
        voiceNote: {
            url: String,
            filename: String,
            duration: String,
            uploadedAt: Date
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: [Number]
        }
    },
    // For support integration
    supportStatus: {
        sent: { type: Boolean, default: false },
        sentAt: Date,
        responded: { type: Boolean, default: false },
        respondedAt: Date,
        response: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        }
    },
    metadata: {
        deviceInfo: String,
        weatherConditions: {
            temperature: Number,
            humidity: Number,
            rainfall: Number
        },
        soilConditions: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
farmLogSchema.index({ farmerId: 1, cropName: 1, createdAt: -1 });
farmLogSchema.index({ logType: 1, createdAt: -1 });
farmLogSchema.index({ 'supportStatus.sent': 1, 'supportStatus.responded': 1 });

// Virtual for formatted date
farmLogSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Virtual for log entry display
farmLogSchema.virtual('displayTitle').get(function() {
    if (this.logType === 'task_completion') {
        return `✅ ${this.title}`;
    } else if (this.logType === 'manual_observation') {
        return `📝 ${this.title}`;
    } else {
        return `⚠️ ${this.title}`;
    }
});

const FarmLog = mongoose.model('FarmLog', farmLogSchema);

module.exports = FarmLog; 