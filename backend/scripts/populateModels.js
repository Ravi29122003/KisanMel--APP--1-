const mongoose = require('mongoose');
const Crop = require('../models/crop');
const Soil = require('../models/soil');
const Weather = require('../models/weather');

// MongoDB connection string - update this with your actual connection string
// For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/kisanmel
// For local MongoDB: mongodb://localhost:27017/kisanmel
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2023ume1691:ravi%401234@cluster0.tjryvzk.mongodb.net/';

async function connectDB() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. If using local MongoDB: Make sure MongoDB is installed and running');
    console.log('2. If using MongoDB Atlas: Check your connection string and network access');
    console.log('3. Set MONGODB_URI environment variable with your connection string');
    console.log('4. For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/kisanmel');
    console.log('5. For local MongoDB: mongodb://localhost:27017/kisanmel');
    process.exit(1);
  }
}

async function populateCrops() {
  const cropData = [
    {
      crop_name: 'Wheat',
      crop_variety: 'HD 2967',
      crop_category: 'Cereals',
      part_used: 'Grain',
      industry_demand: 'High',
      sowing_months: 'October-November',
      ideal_soil_types: ['Clay loam', 'Silty clay loam'],
      germination_weather: 'Cool and moist',
      vegetative_weather: 'Moderate temperature',
      flowering_fruiting_weather: 'Warm and dry',
      harvesting_weather: 'Hot and dry',
      nutrient_needs_npk: '120:60:40 kg/ha',
      expected_yield_per_acre: '20-25 quintals',
      post_harvest_handling: 'Drying and storage',
      crop_duration_days_min: 120,
      crop_duration_days_max: 150,
      optimal_pH_range_min: 6.0,
      optimal_pH_range_max: 7.5
    },
    {
      crop_name: 'Rice',
      crop_variety: 'Pusa Basmati 1121',
      crop_category: 'Cereals',
      part_used: 'Grain',
      industry_demand: 'Very High',
      sowing_months: 'June-July',
      ideal_soil_types: ['Clay', 'Clay loam'],
      germination_weather: 'Warm and humid',
      vegetative_weather: 'Hot and humid',
      flowering_fruiting_weather: 'Warm and humid',
      harvesting_weather: 'Moderate temperature',
      nutrient_needs_npk: '150:75:50 kg/ha',
      expected_yield_per_acre: '25-30 quintals',
      post_harvest_handling: 'Drying and milling',
      crop_duration_days_min: 140,
      crop_duration_days_max: 160,
      optimal_pH_range_min: 5.5,
      optimal_pH_range_max: 6.5
    }
  ];

  try {
    await Crop.insertMany(cropData);
    console.log('✅ Crops populated successfully');
  } catch (error) {
    console.error('❌ Error populating crops:', error.message);
  }
}

async function populateSoils() {
  const soilData = [
    {
      district: 'Punjab',
      pincode: 141001,
      soil_type: ['Clay loam', 'Silty clay loam'],
      nitrogen_kg_ha: 280,
      micronutrients: {
        zinc: 0.8,
        iron: 12.5,
        manganese: 8.2,
        copper: 1.2,
        boron: 0.4
      },
      last_updated: '2024-01-15',
      soil_pH_min: 6.5,
      soil_pH_max: 7.8,
      organic_carbon_percent_min: 0.6,
      organic_carbon_percent_max: 0.9,
      phosphorus_kg_ha_min: 15,
      phosphorus_kg_ha_max: 25,
      potassium_kg_ha_min: 180,
      potassium_kg_ha_max: 250,
      ec_ds_m_min: 0.3,
      ec_ds_m_max: 0.8
    },
    {
      district: 'Haryana',
      pincode: 122001,
      soil_type: ['Sandy loam', 'Loam'],
      nitrogen_kg_ha: 220,
      micronutrients: {
        zinc: 0.6,
        iron: 10.8,
        manganese: 7.5,
        copper: 1.0,
        boron: 0.3
      },
      last_updated: '2024-01-20',
      soil_pH_min: 7.0,
      soil_pH_max: 8.2,
      organic_carbon_percent_min: 0.4,
      organic_carbon_percent_max: 0.7,
      phosphorus_kg_ha_min: 12,
      phosphorus_kg_ha_max: 20,
      potassium_kg_ha_min: 150,
      potassium_kg_ha_max: 200,
      ec_ds_m_min: 0.4,
      ec_ds_m_max: 1.0
    }
  ];

  try {
    await Soil.insertMany(soilData);
    console.log('✅ Soils populated successfully');
  } catch (error) {
    console.error('❌ Error populating soils:', error.message);
  }
}

async function populateWeather() {
  const weatherData = [
    {
      district: 'Punjab',
      pincode: 141001,
      month: 6,
      avg_min_temp_c: 25.5,
      avg_max_temp_c: 38.2,
      avg_rainfall_mm: 120.5,
      avg_humidity_percent: 65,
      avg_sunlight_hours: 8.5,
      year_recorded: 2023
    },
    {
      district: 'Punjab',
      pincode: 141001,
      month: 7,
      avg_min_temp_c: 27.8,
      avg_max_temp_c: 36.8,
      avg_rainfall_mm: 180.2,
      avg_humidity_percent: 75,
      avg_sunlight_hours: 7.2,
      year_recorded: 2023
    },
    {
      district: 'Haryana',
      pincode: 122001,
      month: 6,
      avg_min_temp_c: 26.2,
      avg_max_temp_c: 39.5,
      avg_rainfall_mm: 95.8,
      avg_humidity_percent: 60,
      avg_sunlight_hours: 9.0,
      year_recorded: 2023
    },
    {
      district: 'Haryana',
      pincode: 122001,
      month: 7,
      avg_min_temp_c: 28.5,
      avg_max_temp_c: 37.2,
      avg_rainfall_mm: 150.6,
      avg_humidity_percent: 70,
      avg_sunlight_hours: 7.8,
      year_recorded: 2023
    }
  ];

  try {
    await Weather.insertMany(weatherData);
    console.log('✅ Weather data populated successfully');
  } catch (error) {
    console.error('❌ Error populating weather:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting model population...');
  
  await connectDB();
  
  // Clear existing data (optional - comment out if you want to keep existing data)
  try {
    await Crop.deleteMany({});
    await Soil.deleteMany({});
    await Weather.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
  
  // Populate all models
  await populateCrops();
  await populateSoils();
  await populateWeather();
  
  console.log('🎉 Model population completed!');
  
  // Disconnect from database
  await mongoose.disconnect();
  console.log('👋 Disconnected from MongoDB');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { populateCrops, populateSoils, populateWeather }; 