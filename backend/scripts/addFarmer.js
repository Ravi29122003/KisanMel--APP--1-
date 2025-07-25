const mongoose = require('mongoose');
const Farmer = require('../models/farmerModel');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2023ume1691:ravi%401234@cluster0.tjryvzk.mongodb.net/';

async function connectDB() {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function addFarmer() {
  try {
    // Check if farmer with this mobile number already exists
    const existingFarmer = await Farmer.findOne({ mobileNumber: '1234567890' });
    
    if (existingFarmer) {
      console.log('⚠️  Farmer with mobile number 1234567890 already exists');
      console.log('📱 Existing farmer details:');
      console.log(`   Name: ${existingFarmer.name}`);
      console.log(`   Email: ${existingFarmer.email || 'Not provided'}`);
      console.log(`   Created: ${existingFarmer.createdAt}`);
      return;
    }

    // Create new farmer data
    const farmerData = {
      name: 'Ramesh Kumar',
      mobileNumber: '1234567890',
      email: 'ramesh.kumar@example.com',
      password: '123456',
      farmDetails: {
        pincode: '141001',
        area: 5.5, // 5.5 acres
        location: {
          type: 'Point',
          coordinates: [75.8573, 30.9010] // Ludhiana, Punjab coordinates
        },
        capitalInvestment: 50000, // ₹50,000
        labourCapacity: 3, // 3 people
        irrigationFacility: 'Canal',
        cropCycle: 'Medium Term',
        plotCoordinates: [
          [75.8573, 30.9010],
          [75.8575, 30.9010],
          [75.8575, 30.9008],
          [75.8573, 30.9008]
        ]
      }
    };

    // Create and save the farmer
    const newFarmer = new Farmer(farmerData);
    await newFarmer.save();

    console.log('✅ Farmer added successfully!');
    console.log('📋 Farmer details:');
    console.log(`   Name: ${newFarmer.name}`);
    console.log(`   Mobile: ${newFarmer.mobileNumber}`);
    console.log(`   Email: ${newFarmer.email}`);
    console.log(`   Farm Area: ${newFarmer.farmDetails.area} acres`);
    console.log(`   Pincode: ${newFarmer.farmDetails.pincode}`);
    console.log(`   Irrigation: ${newFarmer.farmDetails.irrigationFacility}`);
    console.log(`   Crop Cycle: ${newFarmer.farmDetails.cropCycle}`);
    console.log(`   Created: ${newFarmer.createdAt}`);

  } catch (error) {
    console.error('❌ Error adding farmer:', error.message);
    if (error.code === 11000) {
      console.log('💡 This mobile number or email is already registered');
    }
  }
}

async function main() {
  try {
    await connectDB();
    await addFarmer();
  } catch (error) {
    console.error('❌ Script execution failed:', error.message);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { addFarmer, connectDB }; 