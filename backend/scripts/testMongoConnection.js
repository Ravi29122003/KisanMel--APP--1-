const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://2023ume1691:ravi%401234@cluster0.tjryvzk.mongodb.net/';

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('📡 Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    // Set mongoose options
    mongoose.set('strictQuery', false);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Available collections:');
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Count documents in farmers collection
    const Farmer = require('../models/farmerModel');
    const farmerCount = await Farmer.countDocuments();
    console.log(`\n👨‍🌾 Total farmers in database: ${farmerCount}`);
    
    // Check if our test farmer exists
    const testFarmer = await Farmer.findOne({ mobileNumber: '1234567890' });
    if (testFarmer) {
      console.log('\n✅ Test farmer found:');
      console.log(`   Name: ${testFarmer.name}`);
      console.log(`   Mobile: ${testFarmer.mobileNumber}`);
      console.log(`   Email: ${testFarmer.email}`);
    }
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongoServerError') {
      console.log('\n🔧 Server error - possible issues:');
      console.log('   - Invalid credentials');
      console.log('   - Database server is down');
      console.log('   - Network connectivity issues');
    } else if (error.name === 'MongoNetworkError') {
      console.log('\n🔧 Network error - possible issues:');
      console.log('   - No internet connection');
      console.log('   - Firewall blocking connection');
      console.log('   - MongoDB Atlas IP whitelist issue');
    }
    
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testConnection(); 