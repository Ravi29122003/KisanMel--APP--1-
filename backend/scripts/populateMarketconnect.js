const mongoose = require('mongoose');
const Marketconnect = require('../models/marketconnect');

// MongoDB connection string - update this with your actual connection string
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
    process.exit(1);
  }
}

async function populateMarketconnect() {
  // Create expiry dates (30 days, 60 days, 90 days from now)
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  const sixtyDaysFromNow = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000));
  const ninetyDaysFromNow = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));

  const marketconnectData = [
    {
      crop: 'Rice',
      variety: 'ADT 53',
      industry_demand: 'High',
      price_per_kg: 35.68,
      demand_quantity: '652 quintals',
      quality_grade: 'A',
      market_type: 'Spot',
      distance_km: 141,
      contract_duration: 'Monthly',
      buyer_details: {
        company_name: 'Punjab Rice Industries',
        contact_person: 'Rajesh Kumar',
        phone_number: '+91-9876543210',
        email: 'rajesh@punjabrice.com',
        address: 'Industrial Area, Phase 2, Chandigarh, Punjab',
        verified: true
      },
      location: {
        district: 'Chandigarh',
        state: 'Punjab',
        pincode: '160002',
        coordinates: {
          latitude: 30.7333,
          longitude: 76.7794
        }
      },
      payment_terms: {
        advance_percentage: 20,
        payment_method: 'Bank Transfer',
        payment_within_days: 7
      },
      minimum_quantity: {
        value: 50,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 500,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 7,
        end_month: 8
      },
      special_requirements: ['Moisture content below 12%', 'No broken grains'],
      status: 'Active',
      expires_on: thirtyDaysFromNow
    },
    {
      crop: 'Rice',
      variety: 'ADT 53',
      industry_demand: 'Medium',
      price_per_kg: 26.83,
      demand_quantity: '713 quintals',
      quality_grade: 'B+',
      market_type: 'Contract',
      distance_km: 78,
      contract_duration: 'Seasonal',
      buyer_details: {
        company_name: 'Haryana Grain Trading Co.',
        contact_person: 'Amit Singh',
        phone_number: '+91-9123456789',
        email: 'amit@haryanagrains.com',
        address: 'Sector 14, Gurgaon, Haryana',
        verified: true
      },
      location: {
        district: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001',
        coordinates: {
          latitude: 28.4595,
          longitude: 77.0266
        }
      },
      payment_terms: {
        advance_percentage: 30,
        payment_method: 'UPI',
        payment_within_days: 3
      },
      minimum_quantity: {
        value: 100,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 800,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 7,
        end_month: 9
      },
      special_requirements: ['Organic certification required', 'Regular quality checks'],
      status: 'Active',
      expires_on: sixtyDaysFromNow
    },
    {
      crop: 'Wheat',
      variety: 'HD 2967',
      industry_demand: 'Very High',
      price_per_kg: 28.50,
      demand_quantity: '1200 quintals',
      quality_grade: 'A+',
      market_type: 'Export',
      distance_km: 225,
      contract_duration: 'Annual',
      buyer_details: {
        company_name: 'Delhi Export House',
        contact_person: 'Priya Sharma',
        phone_number: '+91-9987654321',
        email: 'priya@delhiexport.com',
        address: 'Karol Bagh, New Delhi',
        verified: true
      },
      location: {
        district: 'New Delhi',
        state: 'Delhi',
        pincode: '110005',
        coordinates: {
          latitude: 28.6519,
          longitude: 77.1909
        }
      },
      payment_terms: {
        advance_percentage: 50,
        payment_method: 'Bank Transfer',
        payment_within_days: 15
      },
      minimum_quantity: {
        value: 200,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 1500,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 4,
        end_month: 5
      },
      special_requirements: ['Export quality standards', 'Phytosanitary certificate'],
      status: 'Active',
      expires_on: ninetyDaysFromNow
    },
    {
      crop: 'Sugarcane',
      variety: 'Co 0238',
      industry_demand: 'High',
      price_per_kg: 3.20,
      demand_quantity: '5000 quintals',
      quality_grade: 'A',
      market_type: 'Processing',
      distance_km: 45,
      contract_duration: 'Seasonal',
      buyer_details: {
        company_name: 'UP Sugar Mills',
        contact_person: 'Manoj Gupta',
        phone_number: '+91-9456789123',
        email: 'manoj@upsugarmills.com',
        address: 'Muzaffarnagar, Uttar Pradesh',
        verified: true
      },
      location: {
        district: 'Muzaffarnagar',
        state: 'Uttar Pradesh',
        pincode: '251001',
        coordinates: {
          latitude: 29.4727,
          longitude: 77.7085
        }
      },
      payment_terms: {
        advance_percentage: 10,
        payment_method: 'Cheque',
        payment_within_days: 30
      },
      minimum_quantity: {
        value: 500,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 10000,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 11,
        end_month: 3
      },
      special_requirements: ['Fresh cut within 24 hours', 'Minimum 18% sucrose content'],
      status: 'Active',
      expires_on: sixtyDaysFromNow
    },
    {
      crop: 'Cotton',
      variety: 'Bt Cotton',
      industry_demand: 'High',
      price_per_kg: 58.75,
      demand_quantity: '800 quintals',
      quality_grade: 'A',
      market_type: 'Spot',
      distance_km: 180,
      contract_duration: 'Weekly',
      buyer_details: {
        company_name: 'Gujarat Cotton Corporation',
        contact_person: 'Ravi Patel',
        phone_number: '+91-9876541230',
        email: 'ravi@gujaratcotton.com',
        address: 'Cotton Market, Ahmedabad, Gujarat',
        verified: true
      },
      location: {
        district: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380001',
        coordinates: {
          latitude: 23.0225,
          longitude: 72.5714
        }
      },
      payment_terms: {
        advance_percentage: 25,
        payment_method: 'Online',
        payment_within_days: 5
      },
      minimum_quantity: {
        value: 50,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 1000,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 10,
        end_month: 12
      },
      special_requirements: ['Ginned cotton only', 'Moisture content below 8%'],
      status: 'Active',
      expires_on: thirtyDaysFromNow
    },
    {
      crop: 'Tomato',
      variety: 'Hybrid',
      industry_demand: 'Very High',
      price_per_kg: 15.30,
      demand_quantity: '300 quintals',
      quality_grade: 'A+',
      market_type: 'Spot',
      distance_km: 25,
      contract_duration: 'Daily',
      buyer_details: {
        company_name: 'Fresh Vegetable Market',
        contact_person: 'Sunita Devi',
        phone_number: '+91-9123987456',
        email: 'sunita@freshveggies.com',
        address: 'Vegetable Market, Sector 19, Noida',
        verified: false
      },
      location: {
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        pincode: '201301',
        coordinates: {
          latitude: 28.5355,
          longitude: 77.3910
        }
      },
      payment_terms: {
        advance_percentage: 0,
        payment_method: 'Cash',
        payment_within_days: 1
      },
      minimum_quantity: {
        value: 10,
        unit: 'quintal'
      },
      maximum_quantity: {
        value: 500,
        unit: 'quintal'
      },
      harvest_period: {
        start_month: 1,
        end_month: 12
      },
      special_requirements: ['Fresh harvest only', 'Uniform size and color'],
      status: 'Active',
      expires_on: thirtyDaysFromNow
    }
  ];

  try {
    await Marketconnect.insertMany(marketconnectData);
    console.log('✅ Marketconnect data populated successfully');
    console.log(`📊 Inserted ${marketconnectData.length} market connection records`);
  } catch (error) {
    console.error('❌ Error populating marketconnect data:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Marketconnect data population...');
  
  await connectDB();
  
  // Clear existing data (optional - comment out if you want to keep existing data)
  try {
    const deleteResult = await Marketconnect.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing marketconnect records`);
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
  
  // Populate marketconnect data
  await populateMarketconnect();
  
  // Show some statistics
  try {
    const totalRecords = await Marketconnect.countDocuments();
    const activeRecords = await Marketconnect.countDocuments({ status: 'Active' });
    const spotMarkets = await Marketconnect.countDocuments({ market_type: 'Spot' });
    const contractMarkets = await Marketconnect.countDocuments({ market_type: 'Contract' });
    
    console.log('\n📈 Database Statistics:');
    console.log(`   Total Records: ${totalRecords}`);
    console.log(`   Active Listings: ${activeRecords}`);
    console.log(`   Spot Markets: ${spotMarkets}`);
    console.log(`   Contract Markets: ${contractMarkets}`);
  } catch (error) {
    console.error('❌ Error getting statistics:', error.message);
  }
  
  console.log('🎉 Marketconnect data population completed!');
  
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

module.exports = { populateMarketconnect }; 