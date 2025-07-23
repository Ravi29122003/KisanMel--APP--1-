const mongoose = require('mongoose');
require('dotenv').config();

const Farmer = require('../models/farmerModel');

(async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-mel';
  try {
    console.log(`Connecting to ${uri}`);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const mobile = '1234567890';
    const password = '123456';
    const name = 'Test User';
    const email = 'testuser@example.com';

    // Avoid duplicates when running script multiple times
    const existing = await Farmer.findOne({ mobileNumber: mobile });
    if (existing) {
      console.log('Test user already exists:');
      console.dir({ id: existing._id, mobileNumber: existing.mobileNumber });
      return process.exit(0);
    }

    const user = await Farmer.create({
      name,
      mobileNumber: mobile,
      password,
      email,
      farmDetails: {
        location: {
          type: 'Point',
          coordinates: [0, 0], // dummy coordinates to satisfy 2dsphere index
        },
      },
    });

    console.log('Test user created successfully!');
    console.dir({ id: user._id, mobileNumber: user.mobileNumber }, { colors: true });
  } catch (err) {
    console.error('Error creating test user:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})(); 