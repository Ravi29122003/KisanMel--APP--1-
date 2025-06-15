const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Farmer = require('../models/farmerModel');

dotenv.config({ path: './.env' });

const updateFarmerCropCycles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all farmers with old crop cycle format
    const result = await Farmer.updateMany(
      {
        'farmDetails.cropCycle': { $in: ['short-term', 'medium-term', 'long-term'] }
      },
      [
        {
          $set: {
            'farmDetails.cropCycle': {
              $switch: {
                branches: [
                  { case: { $eq: ['$farmDetails.cropCycle', 'short-term'] }, then: 'Short Term' },
                  { case: { $eq: ['$farmDetails.cropCycle', 'medium-term'] }, then: 'Medium Term' },
                  { case: { $eq: ['$farmDetails.cropCycle', 'long-term'] }, then: 'Long Term' }
                ],
                default: '$farmDetails.cropCycle'
              }
            }
          }
        }
      ]
    );

    console.log('Update result:', result);
    console.log('Successfully updated farmer crop cycles');
    
    // Verify the updates
    const farmers = await Farmer.find({ 'farmDetails.cropCycle': { $exists: true } });
    console.log('\nUpdated farmer records:');
    farmers.forEach(farmer => {
      console.log(`Farmer: ${farmer.name}, Crop Cycle: ${farmer.farmDetails.cropCycle}`);
    });

  } catch (error) {
    console.error('Error updating farmer crop cycles:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

updateFarmerCropCycles(); 