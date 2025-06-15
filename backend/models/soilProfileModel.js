const mongoose = require('mongoose');

const soilProfileSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid 6-digit pincode!`
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  soilType: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Mountain', 'Desert', 'Saline']
  },
  characteristics: {
    texture: {
      type: String,
      required: true,
      enum: ['Sandy', 'Clayey', 'Loamy', 'Sandy Loam', 'Clay Loam', 'Silt Loam']
    },
    color: {
      type: String,
      required: true
    },
    drainage: {
      type: String,
      required: true,
      enum: ['Poor', 'Moderate', 'Good', 'Excellent']
    },
    organicMatter: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High']
    }
  },
  nutrientContent: {
    nitrogen: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    phosphorus: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    potassium: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    ph: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    }
  },
  waterHoldingCapacity: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  suitableCrops: [{
    type: String,
    required: true
  }],
  region: {
    state: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    village: {
      type: String,
      required: true
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'soilprofiles' // Explicitly set collection name
});

// Create index for geospatial queries
soilProfileSchema.index({ location: '2dsphere' });
// Create index for pincode queries
soilProfileSchema.index({ pincode: 1 });

const SoilProfile = mongoose.model('SoilProfile', soilProfileSchema);

module.exports = SoilProfile; 