const mongoose = require('mongoose');
const { Schema } = mongoose;

const SoilSchema = new Schema({
  district: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  soil_type: [{
    type: String
  }],
  nitrogen_kg_ha: {
    type: Number,
    required: true
  },
  micronutrients: {
    type: Schema.Types.Mixed // raw JSON structure
  },
  last_updated: {
    type: String
  },
  soil_pH_min: {
    type: Number,
    required: true
  },
  soil_pH_max: {
    type: Number,
    required: true
  },
  organic_carbon_percent_min: {
    type: Number,
    required: true
  },
  organic_carbon_percent_max: {
    type: Number,
    required: true
  },
  phosphorus_kg_ha_min: {
    type: Number,
    required: true
  },
  phosphorus_kg_ha_max: {
    type: Number,
    required: true
  },
  potassium_kg_ha_min: {
    type: Number,
    required: true
  },
  potassium_kg_ha_max: {
    type: Number,
    required: true
  },
  ec_ds_m_min: {
    type: Number,
    required: true
  },
  ec_ds_m_max: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound indexes
SoilSchema.index({ district: 1, pincode: 1 });

module.exports = mongoose.model('Soil', SoilSchema);
