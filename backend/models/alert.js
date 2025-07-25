const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
        index: true
    },
    alertType: {
        type: String,
        enum: ['weather', 'pest_disease', 'soil', 'market', 'general'],
        required: true,
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        required: true,
        default: 'medium'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    actionRequired: {
        type: String,
        required: false
    },
    affectedCrops: [{
        type: String
    }],
    location: {
        pincode: {
            type: String,
            required: true,
            index: true
        },
        district: String
    },
    weatherData: {
        temperature: Number,
        humidity: Number,
        rainfall: Number,
        windSpeed: Number,
        condition: String
    },
    pestDiseaseData: {
        type: String, // 'pest' or 'disease'
        name: String,
        severity: String,
        nearbyFarmCount: Number,
        identificationGuideUrl: String
    },
    validUntil: {
        type: Date,
        required: true,
        index: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    relatedTaskIds: [{
        type: String
    }],
    metadata: {
        sourceData: mongoose.Schema.Types.Mixed,
        confidence: Number, // 0-1 score
        automatedGeneration: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Index for efficient querying
alertSchema.index({ farmerId: 1, createdAt: -1 });
alertSchema.index({ alertType: 1, priority: 1 });
alertSchema.index({ 'location.pincode': 1, alertType: 1 });
alertSchema.index({ validUntil: 1, isActive: 1 });
alertSchema.index({ isRead: 1, isActive: 1 });

// Virtual for time remaining
alertSchema.virtual('timeRemaining').get(function() {
    const now = new Date();
    const timeDiff = this.validUntil - now;
    
    if (timeDiff <= 0) return 'Expired';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Less than 1 hour remaining';
});

// Virtual for priority icon
alertSchema.virtual('priorityIcon').get(function() {
    switch (this.priority) {
        case 'urgent': return '🚨';
        case 'high': return '⚠️';
        case 'medium': return '⚡';
        case 'low': return 'ℹ️';
        default: return 'ℹ️';
    }
});

// Virtual for alert type icon
alertSchema.virtual('typeIcon').get(function() {
    switch (this.alertType) {
        case 'weather': return '🌤️';
        case 'pest_disease': return '🐛';
        case 'soil': return '🌱';
        case 'market': return '💰';
        case 'general': return '📢';
        default: return '📢';
    }
});

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert; 