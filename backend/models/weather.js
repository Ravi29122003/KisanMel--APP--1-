const mongoose = require('mongoose');
const { Schema } = mongoose;

const WeatherSchema = new Schema({
  district: {
    type: String,
    required: true,
    index: true
  },
  pincode: {
    type: Number,
    required: true,
    index: true
  },
  month: {
    type: Number,
    required: true,
    index: true,
    min: 1,
    max: 12
  },
  avg_min_temp_c: {
    type: Number,
    required: true
  },
  avg_max_temp_c: {
    type: Number,
    required: true
  },
  avg_rainfall_mm: {
    type: Number,
    required: true
  },
  avg_humidity_percent: {
    type: Number,
    required: true
  },
  avg_sunlight_hours: {
    type: Number,
    required: true
  },
  year_recorded: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for quick pincode+month lookups
WeatherSchema.index({ pincode: 1, month: 1 });

module.exports = mongoose.model('Weather', WeatherSchema);
