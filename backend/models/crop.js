const mongoose = require('mongoose');
const { Schema } = mongoose;

const CropSchema = new Schema({
  crop_name: {
    type: String,
    required: true,
    index: true
  },
  crop_variety: {
    type: String
  },
  crop_category: {
    type: String,
    index: true
  },
  part_used: {
    type: String
  },
  industry_demand: {
    type: String
  },
  sowing_months: {
    type: String
  },
  ideal_soil_types: {
    type: [String],
    index: true
  },
  germination_weather: {
    type: String
  },
  vegetative_weather: {
    type: String
  },
  flowering_fruiting_weather: {
    type: String
  },
  harvesting_weather: {
    type: String
  },
  nutrient_needs_npk: {
    type: String
  },
  expected_yield_per_acre: {
    type: String
  },
  post_harvest_handling: {
    type: String
  },
  crop_duration_days_min: {
    type: Number,
    index: true
  },
  crop_duration_days_max: {
    type: Number,
    index: true
  },
  optimal_pH_range_min: {
    type: Number,
    index: true
  },
  optimal_pH_range_max: {
    type: Number,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for better query performance
CropSchema.index({ crop_name: 1, crop_variety: 1 });
CropSchema.index({ optimal_pH_range_min: 1, optimal_pH_range_max: 1 });
CropSchema.index({ crop_duration_days_min: 1, crop_duration_days_max: 1 });
CropSchema.index({ crop_category: 1, crop_duration_days_min: 1 });

module.exports = mongoose.model('Crop', CropSchema);
