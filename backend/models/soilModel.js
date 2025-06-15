const mongoose = require('mongoose');

const soilSchema = new mongoose.Schema({
  pincode: {
    type: String,
    required: true,
    unique: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  soilProfile: {
    type: {
      type: String,
      required: true
    },
    ph: {
      type: Number,
      required: true
    },
    organicMatter: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true
    },
    npk: {
      n: Number,
      p: Number,
      k: Number
    }
  },
  climate: {
    avgTempC: Number,
    avgRainfallMm: Number
  }
}, {
  timestamps: true
});

// Create index for pincode queries
soilSchema.index({ pincode: 1 });
// Create compound index for district and state
soilSchema.index({ district: 1, state: 1 });

const Soil = mongoose.model('Soil', soilSchema);

module.exports = Soil; 