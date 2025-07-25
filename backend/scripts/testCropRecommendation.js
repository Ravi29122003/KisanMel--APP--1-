const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Import models
const Soil = require('../models/soil');
const Crop = require('../models/crop');
const Farmer = require('../models/farmerModel');
const { getCropRecommendations } = require('../utils/cropRecommender');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2023ume1691:ravi%401234@cluster0.tjryvzk.mongodb.net/';

async function testCropRecommendation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check available pincodes in soil data
    const soilCount = await Soil.countDocuments();
    console.log(`\n📊 Total soil records: ${soilCount}`);

    if (soilCount > 0) {
      const sampleSoilData = await Soil.find().limit(5);
      console.log('\n📍 Sample pincodes available:');
      sampleSoilData.forEach(soil => {
        console.log(`   - ${soil.pincode} (${soil.district})`);
      });
    }

    // Check available crops
    const cropCount = await Crop.countDocuments();
    console.log(`\n🌾 Total crops in database: ${cropCount}`);

    // Test with a specific pincode
    const testPincode = '123456'; // Change this to an actual pincode from your data
    console.log(`\n🧪 Testing recommendation for pincode: ${testPincode}`);

    // Check if soil data exists for this pincode
    const soilData = await Soil.findOne({ pincode: { $in: [testPincode, Number(testPincode)] } });
    if (soilData) {
      console.log('✅ Soil data found for pincode');
      console.log(`   Soil type: ${soilData.soil_type}`);
      console.log(`   pH range: ${soilData.soil_pH_min} - ${soilData.soil_pH_max}`);
    } else {
      console.log('❌ No soil data found for this pincode');
      
      // Get an actual pincode from the database
      const firstSoil = await Soil.findOne();
      if (firstSoil) {
        console.log(`\n💡 Try using pincode: ${firstSoil.pincode}`);
      }
    }

    // Test recommendation function
    if (soilData) {
      try {
        const recommendations = await getCropRecommendations(testPincode, 'short-term');
        console.log('\n✅ Recommendations generated successfully!');
        console.log(`   Total recommendations: ${recommendations.recommendations.length}`);
        
        if (recommendations.recommendations.length > 0) {
          console.log('\n🌱 Top 3 recommended crops:');
          recommendations.recommendations.slice(0, 3).forEach((rec, idx) => {
            console.log(`   ${idx + 1}. ${rec.crop.crop_name} (Score: ${rec.score})`);
          });
        }
      } catch (err) {
        console.log('❌ Error generating recommendations:', err.message);
      }
    }

    // Check farmer data
    const farmerCount = await Farmer.countDocuments();
    console.log(`\n👨‍🌾 Total farmers: ${farmerCount}`);
    
    const sampleFarmer = await Farmer.findOne({ 'farmDetails.pincode': { $exists: true } });
    if (sampleFarmer) {
      console.log('\n📱 Sample farmer with farm details:');
      console.log(`   Name: ${sampleFarmer.name}`);
      console.log(`   Mobile: ${sampleFarmer.mobileNumber}`);
      console.log(`   Pincode: ${sampleFarmer.farmDetails?.pincode}`);
      console.log(`   Crop Cycle: ${sampleFarmer.farmDetails?.cropCycle}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testCropRecommendation(); 