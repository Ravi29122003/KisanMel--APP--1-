const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmerModel');
const { sendOTP } = require('../services/otpService');
require('dotenv').config();

// Generate JWT token
const signToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

// Signup
exports.signup = async (req, res) => {
    try {
        const { name, mobileNumber, password, email } = req.body;

        // Check if user already exists
        const existingUser = await Farmer.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists with this mobile number'
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Create new user
        const newUser = await Farmer.create({
            name,
            mobileNumber,
            password,
            email,
            otp,
            otpExpires
        });

        // Send OTP
        await sendOTP(mobileNumber, otp);

        res.status(201).json({
            status: 'success',
            message: 'OTP sent successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        const user = await Farmer.findOne({
            mobileNumber,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid or expired OTP'
            });
        }

        // Clear OTP fields
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate token
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    mobileNumber: user.mobileNumber,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        // Check if user exists
        const user = await Farmer.findOne({ mobileNumber }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect mobile number or password'
            });
        }

        // Generate token
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    mobileNumber: user.mobileNumber,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const user = await Farmer.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Use let so we can optionally set the variable to undefined later
        let updateData = { ...req.body };
        
        // If location is provided but coordinates are missing, remove the location field
        if (updateData.location && (!updateData.location.coordinates || !updateData.location.coordinates.length)) {
            delete updateData.location;
        }

        // If farmDetails is empty, set it to undefined
        if (Object.keys(updateData).length === 0) {
            updateData = undefined;
        }

        const user = await Farmer.findByIdAndUpdate(
            req.user.id,
            { $set: { farmDetails: updateData } },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
}; 