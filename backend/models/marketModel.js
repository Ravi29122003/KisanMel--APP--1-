const mongoose = require('mongoose');

const marketSchema = new mongoose.Schema({
  market_id: {
    type: String,
    required: true,
    unique: true
  },
  marketName: {
    type: String,
    required: true
  },
  location: {
    state: String,
    district: String
  },
  cropPrices: {
    type: Map,
    of: {
      pricePerQuintal: Number,
      trend: {
        type: String,
        enum: ['Rising', 'Stable', 'Falling']
      }
    }
  }
}, {
  timestamps: true
});

const Market = mongoose.model('Market', marketSchema);

module.exports = Market; 