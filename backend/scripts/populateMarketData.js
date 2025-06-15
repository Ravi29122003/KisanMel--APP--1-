const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Market = require('../models/marketModel');

dotenv.config({ path: './.env' });

const marketData = {
  "market_data": [
    {
      "market_id": "jaipur_muhana_mandi", "marketName": "Jaipur (Muhana) Mandi",
      "location": { "state": "Rajasthan", "district": "Jaipur" },
      "cropPrices": {
        "mustard_sarso": { "pricePerQuintal": 5200, "trend": "Stable" },
        "wheat_gehu": { "pricePerQuintal": 2300, "trend": "Rising" },
        "pearl_millet_bajra": { "pricePerQuintal": 2100, "trend": "Stable" },
        "gram_chana": { "pricePerQuintal": 6500, "trend": "Rising" },
        "guar_cluster_bean": { "pricePerQuintal": 5500, "trend": "Falling" },
        "barley_jau": { "pricePerQuintal": 1900, "trend": "Stable" },
        "sesame_til": { "pricePerQuintal": 12500, "trend": "Rising" }
      }
    },
    {
      "market_id": "sikar_mandi", "marketName": "Sikar Mandi",
      "location": { "state": "Rajasthan", "district": "Sikar" },
      "cropPrices": {
        "pearl_millet_bajra": { "pricePerQuintal": 2150, "trend": "Stable" },
        "guar_cluster_bean": { "pricePerQuintal": 5600, "trend": "Falling" },
        "gram_chana": { "pricePerQuintal": 6450, "trend": "Stable" },
        "groundnut_moongphali": { "pricePerQuintal": 6800, "trend": "Rising" },
        "mustard_sarso": { "pricePerQuintal": 5150, "trend": "Stable" }
      }
    },
    {
      "market_id": "ajmer_mandi", "marketName": "Ajmer Mandi",
      "location": { "state": "Rajasthan", "district": "Ajmer" },
      "cropPrices": {
        "wheat_gehu": { "pricePerQuintal": 2280, "trend": "Rising" },
        "barley_jau": { "pricePerQuintal": 1950, "trend": "Stable" },
        "mustard_sarso": { "pricePerQuintal": 5100, "trend": "Stable" },
        "gram_chana": { "pricePerQuintal": 6400, "trend": "Rising" }
      }
    },
    {
      "market_id": "tonk_mandi", "marketName": "Tonk Mandi",
      "location": { "state": "Rajasthan", "district": "Tonk" },
      "cropPrices": {
        "mustard_sarso": { "pricePerQuintal": 5250, "trend": "Rising" },
        "gram_chana": { "pricePerQuintal": 6550, "trend": "Rising" },
        "wheat_gehu": { "pricePerQuintal": 2250, "trend": "Stable" },
        "maize_makka": { "pricePerQuintal": 2050, "trend": "Stable" }
      }
    },
    {
      "market_id": "dausa_mandi", "marketName": "Dausa Mandi",
      "location": { "state": "Rajasthan", "district": "Dausa" },
      "cropPrices": {
        "pearl_millet_bajra": { "pricePerQuintal": 2050, "trend": "Stable" },
        "wheat_gehu": { "pricePerQuintal": 2290, "trend": "Rising" },
        "mustard_sarso": { "pricePerQuintal": 5180, "trend": "Stable" },
        "barley_jau": { "pricePerQuintal": 1880, "trend": "Falling" }
      }
    },
    {
      "market_id": "nagaur_mandi", "marketName": "Nagaur Mandi",
      "location": { "state": "Rajasthan", "district": "Nagaur" },
      "cropPrices": {
        "cumin_jeera": { "pricePerQuintal": 25000, "trend": "Stable" },
        "moth_bean_moth": { "pricePerQuintal": 5800, "trend": "Rising" },
        "guar_cluster_bean": { "pricePerQuintal": 5450, "trend": "Falling" },
        "pearl_millet_bajra": { "pricePerQuintal": 2120, "trend": "Stable" },
        "fenugreek_methi": { "pricePerQuintal": 6200, "trend": "Rising" }
      }
    },
    {
      "market_id": "alwar_mandi", "marketName": "Alwar Mandi",
      "location": { "state": "Rajasthan", "district": "Alwar" },
      "cropPrices": {
        "mustard_sarso": { "pricePerQuintal": 5300, "trend": "Rising" },
        "wheat_gehu": { "pricePerQuintal": 2320, "trend": "Stable" },
        "pearl_millet_bajra": { "pricePerQuintal": 2080, "trend": "Stable" },
        "barley_jau": { "pricePerQuintal": 1920, "trend": "Stable" }
      }
    }
  ]
};

const populateMarketData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop existing markets collection
    await mongoose.connection.collection('markets').drop().catch(err => {
      if (err.code === 26) {
        console.log('Collection does not exist, creating new one');
      } else {
        throw err;
      }
    });

    // Transform cropPrices to Map
    const markets = marketData.market_data.map(market => ({
      ...market,
      cropPrices: new Map(Object.entries(market.cropPrices))
    }));

    // Insert data
    const result = await Market.insertMany(markets);
    console.log(`Successfully inserted ${result.length} market records`);

    const count = await Market.countDocuments();
    console.log(`Total market records in database: ${count}`);

  } catch (error) {
    console.error('Error populating market data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

populateMarketData(); 