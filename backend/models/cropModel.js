const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
    crop_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    name_hi: {
        type: String,
        required: true
    },
    family: {
        type: String,
        required: true
    },
    scientificName: String,
    description: String,
    idealClimate: {
        minTempC: Number,
        maxTempC: Number,
        rainfallMm: Number
    },
    idealSoil: {
        type: {
            type: [String],
            required: true
        },
        phMin: Number,
        phMax: Number
    },
    npkRequirementKgHa: {
        n: Number,
        p: Number,
        k: Number
    },
    waterRequirement: {
        type: String,
        enum: ['Very Low', 'Low', 'Medium', 'High']
    },
    sowingSeason: [String],
    expectedYieldPerHectare: String,
    cropCycle: {
        type: String,
        enum: ['Short Term', 'Medium Term', 'Long Term']
    },
    estimatedCapitalPerAcre: Number,
    laborRequirement: Number,
    imageUrl: String
}, {
    timestamps: true
});

// Drop the old index if it exists
cropSchema.index({ name: 1 }, { unique: true });

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop; 