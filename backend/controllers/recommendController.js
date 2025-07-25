const mongoose = require('mongoose');

// Import the newer detailed models from the `server/models` directory. These were
// intentionally given unique model names (SoilInfo, CropInfo) to avoid naming
// collisions with the legacy models already registered in the backend.
const Soil = require('../models/soil');         // exports the SoilInfo model
const Crop = require('../models/crop');         // exports the CropInfo model
const Weather = require('../models/weather');   // exports the Weather model
const { isWeatherSuitable } = require('../utils/weatherUtils');

/**
 * GET /api/recommend-crops/:pincode
 *
 * Steps:
 * 1. Fetch soil profile by pincode.
 * 2. Fetch 12-month weather stats for the same pincode.
 * 3. Find crops whose:
 *    • ideal soil types overlap the soil profile.
 *    • optimal pH range overlaps the soil pH range.
 *    • nutrient needs (N, P, K) are satisfied by the soil.
 * 4. Further filter crops by ensuring germination requirements are met by
 *    the corresponding month's weather record.
 * 5. Return the final list as JSON.
 */
exports.getRecommendedCrops = async (req, res) => {
  const { pincode } = req.params;

  try {
    // 1) Fetch soil document
    const soilDoc = await Soil.findOne({ pincode: Number(pincode) }).lean();
    if (!soilDoc) {
      return res.status(404).json({ status: 'error', message: 'Soil data not found for this pincode' });
    }

    // 2) Fetch 12 months of weather data (could be less/more – we index by month later)
    const weatherDocs = await Weather.find({ pincode: Number(pincode) }).lean();
    if (!weatherDocs.length) {
      return res.status(404).json({ status: 'error', message: 'Weather data not found for this pincode' });
    }

    // Build quick lookup by month (1-12)
    const weatherByMonth = {};
    weatherDocs.forEach((w) => {
      weatherByMonth[w.month] = w;
    });

    // 3) Pre-filter crops in MongoDB by soil type + pH overlap
    const candidateCrops = await Crop.find({
      ideal_soil_types: { $in: soilDoc.soil_type },
      optimal_pH_min: { $lte: soilDoc.soil_pH_max },
      optimal_pH_max: { $gte: soilDoc.soil_pH_min },
    }).lean();

    // 4) Further filtering in JS – NPK sufficiency & germination weather match
    const sufficientNpk = (crop) => {
      if (!crop.nutrient_needs) return true; // no requirements defined
      const { N, P, K } = crop.nutrient_needs;
      if (N != null && soilDoc.nitrogen != null && soilDoc.nitrogen < N) return false;
      if (P != null && soilDoc.phosphorus_max != null && soilDoc.phosphorus_max < P) return false;
      if (K != null && soilDoc.potassium_max != null && soilDoc.potassium_max < K) return false;
      return true;
    };

    const germinationMatchesWeather = (crop) => {
      const germ = crop.growth_conditions && crop.growth_conditions.germination;
      if (!germ) return true; // no germination constraints provided

      // We expect a `month` property (1-12) in the germination object. If not, we skip the check.
      const month = germ.month;
      if (!month || !weatherByMonth[month]) return true;

      const weather = weatherByMonth[month];

      // Use shared utility for the core temperature & humidity checks
      return isWeatherSuitable(
        {
          min_temp: germ.min_temp_c,
          max_temp: germ.max_temp_c,
          min_humidity: germ.min_humidity_percent,
          max_humidity: germ.max_humidity_percent,
        },
        weather
      );
    };

    const finalCrops = candidateCrops.filter((crop) => sufficientNpk(crop) && germinationMatchesWeather(crop));

    return res.status(200).json({ status: 'success', results: finalCrops.length, data: finalCrops });
  } catch (err) {
    console.error('Error in getRecommendedCrops:', err);
    return res.status(500).json({ status: 'error', message: 'Server error', details: err.message });
  }
}; 