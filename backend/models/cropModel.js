const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Crop name is required'],
        unique: true
    },
    type: {
        type: String,
        required: [true, 'Crop type is required'],
        enum: ['Cereal', 'Pulse', 'Fiber', 'Cash Crop', 'Vegetable', 'Fruit']
    },
    irrigationRequired: {
        type: String,
        required: [true, 'Irrigation requirement is required'],
        enum: ['Low', 'Medium', 'High']
    },
    cycleTime: {
        type: Number,
        required: [true, 'Cycle time is required'],
        min: [30, 'Cycle time must be at least 30 days']
    },
    idealConditions: {
        nitrogen: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        phosphorus: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        potassium: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        },
        ph: {
            min: { type: Number, required: true },
            max: { type: Number, required: true }
        }
    },
    suitableSeasons: [{
        type: String,
        enum: ['Kharif', 'Rabi', 'Zaid']
    }],
    waterRequirement: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High']
    },
    temperatureRange: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    yieldPerAcre: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    marketPrice: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    }
}, {
    timestamps: true
});

// Drop the old index if it exists
cropSchema.index({ name: 1 }, { unique: true });

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop; 