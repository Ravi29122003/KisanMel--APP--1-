const mongoose = require('mongoose');
const { Schema } = mongoose;

const MarketconnectSchema = new Schema({
  crop: {
    type: String,
    required: true,
    index: true
  },
  variety: {
    type: String,
    required: true
  },
  industry_demand: {
    type: String,
    enum: ['Very High', 'High', 'Medium', 'Low'],
    default: 'Medium',
    index: true
  },
  price_per_kg: {
    type: Number,
    required: true,
    index: true
  },
  demand_quantity: {
    type: String,
    required: true
  },
  quality_grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C'],
    default: 'B',
    index: true
  },
  market_type: {
    type: String,
    enum: ['Spot', 'Contract', 'Export', 'Processing'],
    required: true,
    index: true
  },
  distance_km: {
    type: Number,
    required: true,
    index: true
  },
  contract_duration: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Seasonal', 'Annual'],
    default: 'Monthly'
  },
  listed_on: {
    type: Date,
    default: Date.now,
    index: true
  },
  buyer_details: {
    company_name: {
      type: String,
      required: true
    },
    contact_person: {
      type: String,
      required: true
    },
    phone_number: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    address: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  location: {
    district: {
      type: String,
      required: true,
      index: true
    },
    state: {
      type: String,
      required: true,
      index: true
    },
    pincode: {
      type: String,
      required: true,
      index: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  payment_terms: {
    advance_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    payment_method: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Online'],
      default: 'Bank Transfer'
    },
    payment_within_days: {
      type: Number,
      default: 7
    }
  },
  minimum_quantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'quintal'
    }
  },
  maximum_quantity: {
    value: {
      type: Number
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'quintal'
    }
  },
  harvest_period: {
    start_month: {
      type: Number,
      min: 1,
      max: 12
    },
    end_month: {
      type: Number,
      min: 1,
      max: 12
    }
  },
  special_requirements: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Fulfilled', 'Expired', 'Cancelled'],
    default: 'Active',
    index: true
  },
  expires_on: {
    type: Date,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
MarketconnectSchema.index({ crop: 1, variety: 1 });
MarketconnectSchema.index({ market_type: 1, distance_km: 1 });
MarketconnectSchema.index({ price_per_kg: 1, quality_grade: 1 });
MarketconnectSchema.index({ 'location.district': 1, 'location.state': 1 });
MarketconnectSchema.index({ industry_demand: 1, status: 1 });
MarketconnectSchema.index({ listed_on: -1, status: 1 });

// Text index for search functionality
MarketconnectSchema.index({
  crop: 'text',
  variety: 'text',
  'buyer_details.company_name': 'text',
  'location.district': 'text',
  'location.state': 'text'
});

module.exports = mongoose.model('Marketconnect', MarketconnectSchema); 