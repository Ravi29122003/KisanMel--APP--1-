const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const minimist = require('minimist');
require('dotenv').config();

const Farmer = require('../models/farmerModel');

(async () => {
  // Parse CLI args
  const argv = minimist(process.argv.slice(2));
  const { name, mobile, password, email } = argv;

  if (!name || !mobile || !password) {
    console.error('Usage: node scripts/createUser.js --name="Your Name" --mobile="9876543210" --password="yourPassword" [--email="you@example.com"]');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-mel';
  try {
    console.log(`Connecting to ${uri}`);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if user exists
    const existing = await Farmer.findOne({ mobileNumber: mobile });
    if (existing) {
      console.error('A user with this mobile number already exists.');
      process.exit(1);
    }

    // Hash password manually because we bypass pre-save hook by using create (it will hash via pre hook) but to be safe rely on hook.
    const newUser = await Farmer.create({
      name,
      mobileNumber: mobile,
      password,
      email,
    });

    console.log('User created successfully!');
    console.dir({ id: newUser._id, name: newUser.name, mobileNumber: newUser.mobileNumber, email: newUser.email }, { colors: true });
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating user:', err.message);
    process.exit(1);
  }
})(); 