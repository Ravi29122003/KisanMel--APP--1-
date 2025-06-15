const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { getCropRecommendations } = require('../utils/cropRecommender');

dotenv.config({ path: './.env' });

const testRecommendation = async (pincode) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const recommendations = await getCropRecommendations(pincode);
    
    console.log('\nCrop Recommendations for Pincode:', pincode);
    console.log('\nSoil Profile:', recommendations.soilProfile);
    console.log('\nClimate:', recommendations.climate);
    console.log('\nTop 5 Recommended Crops:');
    
    recommendations.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.crop.name} (${rec.crop.name_hi})`);
      console.log('   Score:', rec.score);
      console.log('   Compatibility:');
      console.log('   - Soil Type:', rec.compatibility.soilType ? '✓' : '✗');
      console.log('   - pH Level:', rec.compatibility.ph ? '✓' : '✗');
      console.log('   - Temperature:', rec.compatibility.temperature ? '✓' : '✗');
      console.log('   - Rainfall:', rec.compatibility.rainfall ? '✓' : '✗');
      console.log('   - NPK Levels:', rec.compatibility.npk ? '✓' : '✗');
      console.log('\n   Crop Details:');
      console.log('   - Family:', rec.crop.family);
      console.log('   - Ideal Climate:', rec.crop.idealClimate);
      console.log('   - Ideal Soil:', rec.crop.idealSoil);
      console.log('   - NPK Requirement:', rec.crop.npkRequirementKgHa);
      console.log('   - Water Requirement:', rec.crop.waterRequirement);
      console.log('   - Sowing Season:', rec.crop.sowingSeason.join(', '));
      console.log('   - Expected Yield:', rec.crop.expectedYieldPerHectare);
      console.log('   - Crop Cycle:', rec.crop.cropCycle);
      console.log('   - Estimated Capital/Acre:', `₹${rec.crop.estimatedCapitalPerAcre}`);
      console.log('   - Labor Requirement:', `${rec.crop.laborRequirement} days/acre`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Test with a sample pincode
testRecommendation('302001'); 