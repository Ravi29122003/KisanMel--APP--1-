const jwt = require('jsonwebtoken');
const Farmer = require('../models/farmerModel');
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

// Signup — validate name, mobile, password; hash password (via model pre-save); save; return JWT
exports.signup = async (req, res) => {
    try {
        const { name, mobileNumber, password, email } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({
                status: 'fail',
                message: 'Name is required'
            });
        }
        if (!mobileNumber || !mobileNumber.toString().trim()) {
            return res.status(400).json({
                status: 'fail',
                message: 'Mobile number is required'
            });
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                status: 'fail',
                message: 'Password is required'
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                status: 'fail',
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await Farmer.findOne({ mobileNumber: mobileNumber.toString().trim() });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists with this mobile number'
            });
        }

        // Create user (password is hashed by farmerModel pre-save hook)
        const newUser = await Farmer.create({
            name: name.trim(),
            mobileNumber: mobileNumber.toString().trim(),
            password,
            ...(email && email.trim() ? { email: email.trim() } : {})
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    mobileNumber: newUser.mobileNumber,
                    email: newUser.email
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