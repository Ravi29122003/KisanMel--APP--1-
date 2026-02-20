const Soil = require('../models/soil');
const Crop = require('../models/crop');

const getCropRecommendations = async (pincode, farmerCropCycle) => {
  try {
    // Normalize pincode
    const normalizedPincode = pincode.toString().trim();

    // Support both string and numeric representations in DB (just in case)
    const soilData = await Soil.findOne({ pincode: { $in: [normalizedPincode, Number(normalizedPincode)] } }).lean();

    if (!soilData) {
      throw new Error('No soil data found for this pincode');
    }

    // Extract soil data - handle missing fields gracefully
    const soilType = soilData.Soil_Type || soilData.soil_type || '';
    const soilTypeArray = Array.isArray(soilType) ? soilType : 
                         (typeof soilType === 'string' ? soilType.split(',').map(s => s.trim()) : []);
    
    const nitrogen = soilData.Nitrogen_kg_ha || soilData.nitrogen_kg_ha || 0;
    const phMin = soilData.Soil_pH_min || soilData.soil_pH_min || 6.0;
    const phMax = soilData.Soil_pH_max || soilData.soil_pH_max || 7.5;
    const pMin = soilData.Phosphorus_kg_ha_min || soilData.phosphorus_kg_ha_min || 0;
    const pMax = soilData.Phosphorus_kg_ha_max || soilData.phosphorus_kg_ha_max || pMin;
    
    // Note: Some soil records may not have Potassium data
    const kMin = soilData.Potassium_kg_ha_min || soilData.potassium_kg_ha_min || 
                 soilData.Potassium || soilData.potassium || 100; // Default to moderate value
    const kMax = soilData.Potassium_kg_ha_max || soilData.potassium_kg_ha_max || kMin;

    // farmerCropCycle from DB is already 'Short Term' / 'Medium Term' / 'Long Term'
    // (converted by the setter in farmerModel.js) — use it directly
    const mappedFarmerCropCycle = farmerCropCycle || null;

    // Optimize query: Pre-filter crops at database level by pH compatibility
    // This significantly reduces the amount of data we need to process
    const cropQuery = {};
    
    // Add pH range filter if we have soil pH data
    if (phMin && phMax) {
      cropQuery.$or = [
        {
          $and: [
            { Optimal_pH_Range_min: { $lte: phMax } },
            { Optimal_pH_Range_max: { $gte: phMin } }
          ]
        },
        {
          $and: [
            { optimal_pH_range_min: { $lte: phMax } },
            { optimal_pH_range_max: { $gte: phMin } }
          ]
        },
        // Include crops with no pH data
        {
          $and: [
            { Optimal_pH_Range_min: { $exists: false } },
            { optimal_pH_range_min: { $exists: false } }
          ]
        }
      ];
    }

    // Fetch up to 200 crops with pH pre-filter, fall back to 200 unfiltered
    let allCrops = await Crop.find(cropQuery)
      .limit(200)
      .lean();

    // If we get too few results with pH filtering, get more without filtering
    if (allCrops.length < 20) {
      allCrops = await Crop.find({}).limit(200).lean();
    }

    // Score each crop based on compatibility
    const scoredCrops = allCrops.map(crop => {
      let score = 0;

      // Handle different field naming conventions for crops
      const cropName = crop.crop_name || crop.Crop_Name || crop.Crop_name || 'Unknown Crop';
      const cropVariety = crop.crop_variety || crop.Crop_Variety || '';
      const cropCategory = crop.crop_category || crop.Crop_Category || '';
      const idealSoilTypes = crop.ideal_soil_types || crop.Ideal_Soil_Types || '';
      const cropPhMin = crop.optimal_pH_range_min || crop.Optimal_pH_Range_min || crop.Optimal_pH_range_min || 0;
      const cropPhMax = crop.optimal_pH_range_max || crop.Optimal_pH_Range_max || crop.Optimal_pH_range_max || 14;
      const nutrientNPK = crop.nutrient_needs_npk || crop.Nutrient_Needs_NPK || crop.Nutrient_needs_npk || '';
      const durationMin = crop.crop_duration_days_min || crop.Crop_Duration_days_min || 0;
      const durationMax = crop.crop_duration_days_max || crop.Crop_Duration_days_max || 0;
      const sowingMonths = crop.sowing_months || crop.Sowing_Months || '';
      const expectedYield = crop.expected_yield_per_acre || crop.Expected_Yield_per_Acre || '';
      
      // Parse ideal soil types if it's a string
      const idealSoilTypesArray = Array.isArray(idealSoilTypes) ? idealSoilTypes :
                                  (typeof idealSoilTypes === 'string' ? 
                                   idealSoilTypes.split(',').map(s => s.trim()) : []);

      // Determine crop cycle based on duration
      let cropCycle = 'Medium Term'; // default
      if (durationMin && durationMax) {
        const avgDuration = (durationMin + durationMax) / 2;
        if (avgDuration <= 120) {
          cropCycle = 'Short Term';
        } else if (avgDuration <= 365) {
          cropCycle = 'Medium Term';
        } else {
          cropCycle = 'Long Term';
        }
      }

      // Check soil type compatibility
      if (idealSoilTypesArray.length > 0 && soilTypeArray.length > 0) {
        // Check if any of the crop's ideal soil types match any of the soil types at this location
        const soilTypeMatch = idealSoilTypesArray.some(idealType => 
          soilTypeArray.some(soilT => 
            soilT.toLowerCase().includes(idealType.toLowerCase()) || 
            idealType.toLowerCase().includes(soilT.toLowerCase())
          )
        );
        if (soilTypeMatch) {
          score += 3;
        }
      }

      // Check pH compatibility (within range)
      if (cropPhMin && cropPhMax && phMin && phMax) {
        // Check if pH ranges overlap
        if (phMin <= cropPhMax && phMax >= cropPhMin) {
          score += 2;
        }
      }

      // Check NPK compatibility
      const npkScore = calculateNPKScore(
        { nitrogen, pMin, pMax, kMin, kMax },
        { nutrient_needs_npk: nutrientNPK }
      );
      score += npkScore;

      // Give bonus points for matching crop cycle
      let cropCycleMatch = false;
      if (farmerCropCycle && mappedFarmerCropCycle) {
        if (cropCycle === mappedFarmerCropCycle) {
          cropCycleMatch = true;
          score += 2; // Bonus points for matching farmer's preferred cycle
        }
      }

      return {
        crop: {
          ...crop,
          crop_name: cropName,
          crop_variety: cropVariety,
          crop_category: cropCategory,
          cropCycle: cropCycle,
          sowing_months: sowingMonths,
          expected_yield_per_acre: expectedYield,
          crop_duration_days_min: durationMin,
          crop_duration_days_max: durationMax,
          nutrient_needs_npk: nutrientNPK
        },
        score,
        compatibility: {
          soilType: idealSoilTypesArray.length > 0 && soilTypeArray.length > 0 ? 
            idealSoilTypesArray.some(idealType => 
              soilTypeArray.some(soilT => 
                soilT.toLowerCase().includes(idealType.toLowerCase()) || 
                idealType.toLowerCase().includes(soilT.toLowerCase())
              )
            ) : false,
          ph: cropPhMin && cropPhMax && phMin && phMax ?
              (phMin <= cropPhMax && phMax >= cropPhMin) : false,
          npk: npkScore > 0,
          cropCycle: cropCycleMatch
        }
      };
    });

    // Sort by score and return top recommendations (limit to 20 for frontend performance)
    const topCrops = scoredCrops
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return {
      pincode,
      soilProfile: {
        type: soilTypeArray,
        ph: { min: phMin, max: phMax },
        nitrogen,
        phosphorus: { min: pMin, max: pMax },
        potassium: { min: kMin, max: kMax }
      },
      farmerCropCycle: farmerCropCycle,
      recommendations: topCrops
    };

  } catch (error) {
    throw new Error(`Error getting crop recommendations: ${error.message}`);
  }
};

// Helper function to calculate NPK compatibility score
const calculateNPKScore = (soilNPK, crop) => {
  let score = 0;
  
  // Parse NPK requirements from the string format "120:60:40 kg/ha"
  if (crop.nutrient_needs_npk && typeof crop.nutrient_needs_npk === 'string') {
    const npkMatch = crop.nutrient_needs_npk.match(/(\d+):(\d+):(\d+)/);
    if (npkMatch) {
      const [, nRequired, pRequired, kRequired] = npkMatch.map(Number);
      
      // Check nitrogen (allow 0 nitrogen to still get some score if requirement is low)
      if (nRequired > 0) {
        if (soilNPK.nitrogen >= nRequired * 0.8) {
          score += 1;
        } else if (soilNPK.nitrogen >= nRequired * 0.5) {
          score += 0.5;
        }
      }
      
      // Check phosphorus (using average of min and max)
      const avgPhosphorus = (soilNPK.pMin + soilNPK.pMax) / 2;
      if (avgPhosphorus >= pRequired * 0.8) score += 1;
      
      // Check potassium (using average of min and max)
      const avgPotassium = (soilNPK.kMin + soilNPK.kMax) / 2;
      if (avgPotassium >= kRequired * 0.8) score += 1;
    }
  }
  
  return score;
};

module.exports = { getCropRecommendations }; 