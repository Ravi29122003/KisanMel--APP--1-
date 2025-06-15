const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Soil = require('../models/soilModel');

dotenv.config({ path: './.env' });

const soilData = {
  "locations": [
    { "pincode": "302001", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.5, "organicMatter": "Medium", "npk": { "n": 110, "p": 45, "k": 180 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302002", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.4, "organicMatter": "Medium", "npk": { "n": 122, "p": 52, "k": 195 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302003", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.3, "organicMatter": "High", "npk": { "n": 130, "p": 58, "k": 210 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302004", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.6, "organicMatter": "Medium", "npk": { "n": 112, "p": 46, "k": 182 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302005", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.5, "organicMatter": "Medium", "npk": { "n": 125, "p": 55, "k": 200 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302006", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.7, "organicMatter": "Medium", "npk": { "n": 108, "p": 44, "k": 178 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302011", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.6, "organicMatter": "Medium", "npk": { "n": 115, "p": 48, "k": 185 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302012", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.4, "organicMatter": "Medium", "npk": { "n": 120, "p": 50, "k": 190 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302013", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.8, "organicMatter": "Low", "npk": { "n": 98, "p": 41, "k": 172 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302015", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.3, "organicMatter": "High", "npk": { "n": 135, "p": 59, "k": 215 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302016", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.5, "organicMatter": "Medium", "npk": { "n": 111, "p": 45, "k": 181 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302017", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.4, "organicMatter": "Medium", "npk": { "n": 124, "p": 54, "k": 198 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302018", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.6, "organicMatter": "Medium", "npk": { "n": 114, "p": 47, "k": 184 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302019", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.5, "organicMatter": "Medium", "npk": { "n": 126, "p": 56, "k": 202 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302020", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.7, "organicMatter": "Low", "npk": { "n": 105, "p": 43, "k": 175 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302021", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.8, "organicMatter": "Low", "npk": { "n": 102, "p": 42, "k": 173 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302022", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.2, "organicMatter": "High", "npk": { "n": 138, "p": 61, "k": 218 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "302028", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Hilly Soil", "ph": 7.1, "organicMatter": "Medium", "npk": { "n": 102, "p": 43, "k": 177 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 650 } },
    { "pincode": "303007", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.3, "organicMatter": "Medium", "npk": { "n": 125, "p": 55, "k": 200 } }, "climate": { "avgTempC": 25.6, "avgRainfallMm": 640 } },
    { "pincode": "303328", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.8, "organicMatter": "Low", "npk": { "n": 95, "p": 40, "k": 170 } }, "climate": { "avgTempC": 25.7, "avgRainfallMm": 630 } },
    { "pincode": "303104", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.4, "organicMatter": "Medium", "npk": { "n": 120, "p": 50, "k": 190 } }, "climate": { "avgTempC": 25.4, "avgRainfallMm": 660 } },
    { "pincode": "303901", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 7.9, "organicMatter": "Low", "npk": { "n": 90, "p": 38, "k": 165 } }, "climate": { "avgTempC": 25.8, "avgRainfallMm": 610 } },
    { "pincode": "303301", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.2, "organicMatter": "High", "npk": { "n": 140, "p": 60, "k": 220 } }, "climate": { "avgTempC": 25.5, "avgRainfallMm": 670 } },
    { "pincode": "303604", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Sandy Loam", "ph": 8.0, "organicMatter": "Low", "npk": { "n": 85, "p": 35, "k": 160 } }, "climate": { "avgTempC": 26.0, "avgRainfallMm": 600 } },
    { "pincode": "303706", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Alluvial", "ph": 7.5, "organicMatter": "Medium", "npk": { "n": 115, "p": 48, "k": 185 } }, "climate": { "avgTempC": 25.9, "avgRainfallMm": 620 } },
    { "pincode": "303002", "district": "Jaipur", "state": "Rajasthan", "soilProfile": { "type": "Hilly Soil", "ph": 7.1, "organicMatter": "Medium", "npk": { "n": 100, "p": 42, "k": 175 } }, "climate": { "avgTempC": 25.3, "avgRainfallMm": 680 } }
  ]
};

const populateSoilData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing soils collection
    await mongoose.connection.collection('soils').drop().catch(err => {
      if (err.code === 26) {
        console.log('Collection does not exist, creating new one');
      } else {
        throw err;
      }
    });

    // Insert data
    const result = await Soil.insertMany(soilData.locations);
    console.log(`Successfully inserted ${result.length} soil records`);

    const count = await Soil.countDocuments();
    console.log(`Total soil records in database: ${count}`);

  } catch (error) {
    console.error('Error populating soil data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

populateSoilData(); 