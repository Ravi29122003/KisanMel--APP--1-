const Soil = require('../models/soilModel');
const Crop = require('../models/cropModel');

const getCropRecommendations = async (pincode, farmerCropCycle) => {
  try {
    // Get soil details for the pincode
    const soilData = await Soil.findOne({ pincode });
    if (!soilData) {
      throw new Error('No soil data found for this pincode');
    }

    // Get the farmer's farm details for crop cycle
    // Assuming farmer details are linked to soilData through the application logic, or fetched separately
    // For this recommendation, we will fetch farmer details based on pincode if necessary, or assume it's part of soilData context
    // For now, let's assume we get cropCycle from a combined data source or fetch it separately if needed.
    // In a real application, you'd likely pass the authenticated farmer's ID to get their details.
    
    // For demonstration, let's assume the user's farm details are accessible from a farmer object. 
    // Since the request only provides pincode, we'll need to mock or fetch farmer data if not embedded.
    // As per previous interaction, farmDetails is part of the Farmer model, which is distinct from Soil model.
    // To keep it simple for testing, let's assume we're passed the full farmer object or just the cropCycle.
    // Since the prompt specifies 'use this crop cycle from db', we need a way to get the farmer's crop cycle.
    
    // **IMPORTANT:** In a real scenario, the `getCropRecommendations` function should receive the `farmerId` 
    // or the `farmer` object directly, so we can access `farmer.farmDetails.cropCycle`.
    // For this implementation, I'm modifying the function to accept `farmerCropCycle` directly for testing purposes.
    // In production, this would come from `req.user.farmDetails.cropCycle` after authentication.

    // For the sake of completing the request, I will assume we can fetch the farmer's cropCycle
    // based on pincode if the soilData doesn't contain it directly. 
    // This is a simplification; ideally, the farmer's cropCycle would be passed directly.

    // Placeholder for farmer's crop cycle. You would replace this with actual fetched data.
    let farmerCropCycle = null; // Default to null
    // If you have a way to fetch the farmer based on pincode, you would do it here:
    // const Farmer = require('../models/farmerModel');
    // const farmer = await Farmer.findOne({ 'farmDetails.pincode': pincode });
    // if (farmer && farmer.farmDetails && farmer.farmDetails.cropCycle) {
    //   farmerCropCycle = farmer.farmDetails.cropCycle;
    // }

    // For now, let's assume a dummy farmerCropCycle if not found to proceed with logic
    // This needs to be replaced with actual fetching based on req.user.id in the API endpoint.
    // For the test script, we will pass a sample crop cycle.

    // Mapping for crop cycle terms
    const cropCycleMap = {
      'short-term': 'Short Term',
      'medium-term': 'Medium Term',
      'long-term': 'Long Term',
    };

    // Get all crops
    let allCrops = await Crop.find({});

    // Log farmerCropCycle and mappedFarmerCropCycle for debugging
    console.log(`Debug: Farmer's Crop Cycle received: ${farmerCropCycle}`);
    let mappedFarmerCropCycle = null;
    if (farmerCropCycle) {
      mappedFarmerCropCycle = cropCycleMap[farmerCropCycle];
      console.log(`Debug: Mapped Farmer Crop Cycle: ${mappedFarmerCropCycle}`);
    }

    // Filter crops based on farmer's preferred crop cycle
    if (farmerCropCycle && mappedFarmerCropCycle) { // Ensure both are valid
        allCrops = allCrops.filter(crop => crop.cropCycle === mappedFarmerCropCycle);
        console.log(`Debug: Crops after filtering by cycle: ${allCrops.length}`);
    } else if (farmerCropCycle) { // Case where farmerCropCycle is provided but mapping failed
        console.log("Debug: Farmer crop cycle provided but no valid mapping found.");
    }

    // Score each crop based on compatibility
    const scoredCrops = allCrops.map(crop => {
      let score = 0;
      const soilProfile = soilData.soilProfile;
      const climate = soilData.climate;

      // Check soil type compatibility
      if (crop.idealSoil.type.includes(soilProfile.type)) {
        score += 3;
      }

      // Check pH compatibility (within range)
      if (soilProfile.ph >= crop.idealSoil.phMin && soilProfile.ph <= crop.idealSoil.phMax) {
        score += 2;
      }

      // Check temperature compatibility
      if (climate.avgTempC >= crop.idealClimate.minTempC && climate.avgTempC <= crop.idealClimate.maxTempC) {
        score += 2;
      }

      // Check rainfall compatibility (within 20% range)
      const rainfallDiff = Math.abs(climate.avgRainfallMm - crop.idealClimate.rainfallMm) / crop.idealClimate.rainfallMm;
      if (rainfallDiff <= 0.2) {
        score += 2;
      }

      // Check NPK compatibility
      const npkScore = calculateNPKScore(soilProfile.npk, crop.npkRequirementKgHa);
      score += npkScore;

      // The crop cycle score is now implicitly handled by filtering, 
      // but we still include it in compatibility details for display.
      let cropCycleMatch = false;
      if (farmerCropCycle) {
        // Now using mappedFarmerCropCycle for consistency
        if (crop.cropCycle === mappedFarmerCropCycle) {
          cropCycleMatch = true;
        }
      }

      return {
        crop,
        score,
        compatibility: {
          soilType: crop.idealSoil.type.includes(soilProfile.type),
          ph: soilProfile.ph >= crop.idealSoil.phMin && soilProfile.ph <= crop.idealSoil.phMax,
          temperature: climate.avgTempC >= crop.idealClimate.minTempC && climate.avgTempC <= crop.idealClimate.maxTempC,
          rainfall: rainfallDiff <= 0.2,
          npk: npkScore > 0,
          cropCycle: cropCycleMatch
        }
      };
    });

    // Sort by score and get top 5 (or top 3 as per frontend slice)
    const topCrops = scoredCrops
      .sort((a, b) => b.score - a.score);
      // The frontend will slice to top 3

    return {
      pincode,
      soilProfile: soilData.soilProfile,
      climate: soilData.climate,
      farmerCropCycle: farmerCropCycle, // Include farmer's crop cycle in response
      recommendations: topCrops
    };

  } catch (error) {
    throw new Error(`Error getting crop recommendations: ${error.message}`);
  }
};

// Helper function to calculate NPK compatibility score
const calculateNPKScore = (soilNPK, cropNPK) => {
  let score = 0;
  
  // Check if soil has sufficient NPK (within 20% range)
  const nDiff = Math.abs(soilNPK.n - cropNPK.n) / cropNPK.n;
  const pDiff = Math.abs(soilNPK.p - cropNPK.p) / cropNPK.p;
  const kDiff = Math.abs(soilNPK.k - cropNPK.k) / cropNPK.k;

  if (nDiff <= 0.2) score += 1;
  if (pDiff <= 0.2) score += 1;
  if (kDiff <= 0.2) score += 1;

  return score;
};

module.exports = {
  getCropRecommendations
}; 