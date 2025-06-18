const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide your name'] 
    },
    mobileNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        unique: true, 
        sparse: true 
    },
    password: { 
        type: String, 
        required: true, 
        select: false 
    },
    otp: String,
    otpExpires: Date,
    farmDetails: {
        pincode: { type: String },
        area: { type: Number },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: undefined
            }
        },
        capitalInvestment: { type: Number },
        labourCapacity: { type: Number },
        irrigationFacility: {
            type: String,
            enum: ['Drip', 'Sprinkler', 'Canal', 'Rain-fed', 'Other'],
        },
        cropCycle: {
            type: String,
            enum: ['Short Term', 'Medium Term', 'Long Term'],
            set: function(value) {
                // Convert any incoming value to the correct format
                if (value === 'short-term') return 'Short Term';
                if (value === 'medium-term') return 'Medium Term';
                if (value === 'long-term') return 'Long Term';
                return value;
            }
        },
        plotCoordinates: { type: [[Number]], default: [] }
    }
}, { 
    timestamps: true 
});

// Remove the geospatial index for now
// farmerSchema.index({ 'farmDetails.location': '2dsphere' });

// Hash password before saving
farmerSchema.pre('save', async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) return next();
    
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check if password is correct
farmerSchema.methods.correctPassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer; 