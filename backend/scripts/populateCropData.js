const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Crop = require('../models/cropModel');

dotenv.config({ path: './.env' });

const cropData = {
  "crops": [
    { 
      "crop_id": "pearl_millet_bajra", 
      "name": "Pearl Millet (Bajra)", 
      "name_hi": "बाजरा", 
      "family": "Cereal", 
      "idealClimate": { "minTempC": 25, "maxTempC": 35, "rainfallMm": 400 }, 
      "idealSoil": { "type": ["Sandy", "Sandy Loam"], "phMin": 6.5, "phMax": 8.5 }, 
      "npkRequirementKgHa": { "n": 50, "p": 25, "k": 15 }, 
      "waterRequirement": "Low", 
      "sowingSeason": ["Kharif"], 
      "expectedYieldPerHectare": "2-3 tons", 
      "cropCycle": "Short Term", 
      "estimatedCapitalPerAcre": 14000, 
      "laborRequirement": 30 
    },
    { 
      "crop_id": "mustard_sarso", 
      "name": "Mustard (Sarso)", 
      "name_hi": "सरसों", 
      "family": "Oilseed", 
      "idealClimate": { "minTempC": 10, "maxTempC": 25, "rainfallMm": 400 }, 
      "idealSoil": { "type": ["Alluvial", "Sandy Loam"], "phMin": 6.0, "phMax": 7.5 }, 
      "npkRequirementKgHa": { "n": 70, "p": 40, "k": 20 }, 
      "waterRequirement": "Medium", 
      "sowingSeason": ["Rabi"], 
      "expectedYieldPerHectare": "1.5-2.5 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 18000, 
      "laborRequirement": 35 
    },
    { 
      "crop_id": "wheat_gehu", 
      "name": "Wheat (Gehu)", 
      "name_hi": "गेहूँ", 
      "family": "Cereal", 
      "idealClimate": { "minTempC": 12, "maxTempC": 25, "rainfallMm": 750 }, 
      "idealSoil": { "type": ["Loam", "Alluvial", "Brown Soil"], "phMin": 6.0, "phMax": 7.5 }, 
      "npkRequirementKgHa": { "n": 120, "p": 60, "k": 40 }, 
      "waterRequirement": "High", 
      "sowingSeason": ["Rabi"], 
      "expectedYieldPerHectare": "4-5 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 30000, 
      "laborRequirement": 45 
    },
    { 
      "crop_id": "gram_chana", 
      "name": "Gram (Chana)", 
      "name_hi": "चना", 
      "family": "Legume", 
      "idealClimate": { "minTempC": 15, "maxTempC": 28, "rainfallMm": 450 }, 
      "idealSoil": { "type": ["Sandy Loam", "Loam"], "phMin": 6.0, "phMax": 8.0 }, 
      "npkRequirementKgHa": { "n": 20, "p": 60, "k": 20 }, 
      "waterRequirement": "Low", 
      "sowingSeason": ["Rabi"], 
      "expectedYieldPerHectare": "1-1.5 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 15000, 
      "laborRequirement": 30 
    },
    { 
      "crop_id": "guar_cluster_bean", 
      "name": "Guar (Cluster Bean)", 
      "name_hi": "ग्वार", 
      "family": "Legume", 
      "idealClimate": { "minTempC": 25, "maxTempC": 40, "rainfallMm": 300 }, 
      "idealSoil": { "type": ["Sandy", "Sierozems", "Desert Soil"], "phMin": 7.0, "phMax": 8.5 }, 
      "npkRequirementKgHa": { "n": 20, "p": 40, "k": 0 }, 
      "waterRequirement": "Very Low", 
      "sowingSeason": ["Kharif"], 
      "expectedYieldPerHectare": "0.5-1 ton", 
      "cropCycle": "Short Term", 
      "estimatedCapitalPerAcre": 10000, 
      "laborRequirement": 25 
    },
    { 
      "crop_id": "barley_jau", 
      "name": "Barley (Jau)", 
      "name_hi": "जौ", 
      "family": "Cereal", 
      "idealClimate": { "minTempC": 12, "maxTempC": 20, "rainfallMm": 500 }, 
      "idealSoil": { "type": ["Sandy Loam", "Alluvial", "Sierozems"], "phMin": 6.5, "phMax": 8.0 }, 
      "npkRequirementKgHa": { "n": 60, "p": 30, "k": 20 }, 
      "waterRequirement": "Medium", 
      "sowingSeason": ["Rabi"], 
      "expectedYieldPerHectare": "3-3.5 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 22000, 
      "laborRequirement": 40 
    },
    { 
      "crop_id": "moth_bean_moth", 
      "name": "Moth Bean (Moth)", 
      "name_hi": "मोठ", 
      "family": "Legume", 
      "idealClimate": { "minTempC": 24, "maxTempC": 38, "rainfallMm": 300 }, 
      "idealSoil": { "type": ["Sandy", "Desert Soil"], "phMin": 6.0, "phMax": 8.5 }, 
      "npkRequirementKgHa": { "n": 10, "p": 40, "k": 0 }, 
      "waterRequirement": "Very Low", 
      "sowingSeason": ["Kharif"], 
      "expectedYieldPerHectare": "0.6-0.8 tons", 
      "cropCycle": "Short Term", 
      "estimatedCapitalPerAcre": 9000, 
      "laborRequirement": 20 
    },
    { 
      "crop_id": "sorghum_jowar", 
      "name": "Sorghum (Jowar)", 
      "name_hi": "ज्वार", 
      "family": "Cereal", 
      "idealClimate": { "minTempC": 26, "maxTempC": 34, "rainfallMm": 500 }, 
      "idealSoil": { "type": ["Sandy Loam", "Clay Loam", "Alluvial"], "phMin": 6.0, "phMax": 8.5 }, 
      "npkRequirementKgHa": { "n": 90, "p": 45, "k": 45 }, 
      "waterRequirement": "Medium", 
      "sowingSeason": ["Kharif"], 
      "expectedYieldPerHectare": "2.5-3.5 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 16000, 
      "laborRequirement": 35 
    },
    { 
      "crop_id": "onion_pyaaz", 
      "name": "Onion (Pyaaz)", 
      "name_hi": "प्याज", 
      "family": "Vegetable", 
      "idealClimate": { "minTempC": 13, "maxTempC": 25, "rainfallMm": 700 }, 
      "idealSoil": { "type": ["Sandy Loam", "Loam", "Alluvial"], "phMin": 6.0, "phMax": 7.0 }, 
      "npkRequirementKgHa": { "n": 100, "p": 50, "k": 50 }, 
      "waterRequirement": "High", 
      "sowingSeason": ["Rabi"], 
      "expectedYieldPerHectare": "10-12 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 50000, 
      "laborRequirement": 80 
    },
    { 
      "crop_id": "tomato_tamatar", 
      "name": "Tomato (Tamatar)", 
      "name_hi": "टमाटर", 
      "family": "Vegetable", 
      "idealClimate": { "minTempC": 21, "maxTempC": 27, "rainfallMm": 600 }, 
      "idealSoil": { "type": ["Sandy Loam", "Loam", "Red Loam"], "phMin": 6.0, "phMax": 7.0 }, 
      "npkRequirementKgHa": { "n": 120, "p": 80, "k": 80 }, 
      "waterRequirement": "High", 
      "sowingSeason": ["Kharif", "Rabi"], 
      "expectedYieldPerHectare": "15-20 tons", 
      "cropCycle": "Medium Term", 
      "estimatedCapitalPerAcre": 45000, 
      "laborRequirement": 90 
    },
    { 
      "crop_id": "chilli_mirch", 
      "name": "Chilli (Mirch)", 
      "name_hi": "मिर्च", 
      "family": "Vegetable", 
      "idealClimate": { "minTempC": 20, "maxTempC": 30, "rainfallMm": 800 }, 
      "idealSoil": { "type": ["Sandy Loam", "Loam"], "phMin": 6.5, "phMax": 7.5 }, 
      "npkRequirementKgHa": { "n": 100, "p": 60, "k": 60 }, 
      "waterRequirement": "Medium", 
      "sowingSeason": ["Kharif", "Rabi"], 
      "expectedYieldPerHectare": "3-4 tons (Dry)", 
      "cropCycle": "Long Term", 
      "estimatedCapitalPerAcre": 42000, 
      "laborRequirement": 100 
    }
  ]
};

const populateCropData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing crops collection
    await mongoose.connection.collection('crops').drop().catch(err => {
      if (err.code === 26) {
        console.log('Collection does not exist, creating new one');
      } else {
        throw err;
      }
    });

    // Transform and insert data
    const crops = cropData.crops.map(crop => ({
      ...crop,
      idealSoil: {
        type: crop.idealSoil.type,
        phMin: crop.idealSoil.phMin,
        phMax: crop.idealSoil.phMax
      }
    }));

    const result = await Crop.insertMany(crops);
    console.log(`Successfully inserted ${result.length} crop records`);

    const count = await Crop.countDocuments();
    console.log(`Total crop records in database: ${count}`);

  } catch (error) {
    console.error('Error populating crop data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

populateCropData(); 