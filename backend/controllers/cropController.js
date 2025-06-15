const Crop = require('../models/cropModel');
const { getCropRecommendations } = require('../utils/cropRecommender');
const Farmer = require('../models/farmerModel');

// Get all crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find();
    res.status(200).json({
      status: 'success',
      results: crops.length,
      data: crops
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get crop by ID
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({
        status: 'error',
        message: 'Crop not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: crop
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get crop recommendations based on pincode and farmer's crop cycle preference
exports.getCropRecommendations = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    // Debug: Log req.user to check if it's populated
    console.log('Debug: req.user in getCropRecommendations:', req.user);

    if (!pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode is required'
      });
    }

    // Fetch the farmer to get their crop cycle preference
    const farmer = await Farmer.findById(req.user.id);

    // Debug: Log the farmer object after fetching
    console.log('Debug: Farmer object fetched:', farmer);

    if (!farmer || !farmer.farmDetails || !farmer.farmDetails.cropCycle) {
      // Fallback or error if farmer's crop cycle is not found
      return res.status(400).json({
        status: 'error',
        message: `Farmer's crop cycle preference not found. Please complete farm setup.`
      });
    }
    const farmerCropCycle = farmer.farmDetails.cropCycle;

    const recommendations = await getCropRecommendations(pincode, farmerCropCycle);
    
    res.status(200).json({
      status: 'success',
      data: recommendations
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 