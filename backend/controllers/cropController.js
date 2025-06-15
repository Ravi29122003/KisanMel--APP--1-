const Crop = require('../models/cropModel');
const SoilProfile = require('../models/soilModel');
const Farmer = require('../models/farmerModel');

// Calculate suitability score for a crop based on soil conditions
const calculateSuitabilityScore = (soilData, crop) => {
    let score = 0;
    const conditions = crop.idealConditions;

    // Check if soil values are within ideal ranges
    if (soilData.nitrogen >= conditions.nitrogen.min && 
        soilData.nitrogen <= conditions.nitrogen.max) {
        score += 1;
    }
    if (soilData.phosphorus >= conditions.phosphorus.min && 
        soilData.phosphorus <= conditions.phosphorus.max) {
        score += 1;
    }
    if (soilData.potassium >= conditions.potassium.min && 
        soilData.potassium <= conditions.potassium.max) {
        score += 1;
    }
    if (soilData.ph >= conditions.ph.min && 
        soilData.ph <= conditions.ph.max) {
        score += 1;
    }

    return score;
};

// Get crop recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const { irrigation, cycleTime } = req.body;
        const farmer = await Farmer.findById(req.user.id);

        if (!farmer.farmDetails || !farmer.farmDetails.pincode) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please update your farm details with pincode first'
            });
        }

        // Get soil data for the farmer's pincode
        const soilData = await SoilProfile.findOne({ 
            pincode: farmer.farmDetails.pincode 
        });

        if (!soilData) {
            return res.status(404).json({
                status: 'fail',
                message: 'Soil data not available for your area'
            });
        }

        // Build query for crops
        const query = {
            'irrigationRequired': irrigation
        };

        if (cycleTime) {
            query.cycleTime = { $lte: cycleTime };
        }

        // Get all matching crops
        const crops = await Crop.find(query);

        // Calculate suitability scores and sort
        const scoredCrops = crops.map(crop => ({
            ...crop.toObject(),
            suitabilityScore: calculateSuitabilityScore(soilData, crop)
        }));

        // Sort by suitability score and get top 5
        const recommendations = scoredCrops
            .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
            .slice(0, 5);

        res.status(200).json({
            status: 'success',
            data: {
                recommendations,
                soilData
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 