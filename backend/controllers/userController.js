const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Invalid credentials' }); // Generic message
    }

    const { email, phone, password } = req.body;

    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            rewardPoints: user.rewardPoints || 0,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, email, phone, password } = req.body;

    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPhone = phone ? phone.trim() : undefined;

    const userExists = await User.findOne({
        $or: [
            { email: trimmedEmail },
            { phone: trimmedPhone ? trimmedPhone : 'NOT_PROVIDED' }
        ]
    });

    if (userExists) {
        return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    try {
        const user = await User.create({
            name,
            email: trimmedEmail,
            phone: trimmedPhone,
            password,
        });

        if (user) {
            console.log('Signup Success:', user._id);
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                rewardPoints: user.rewardPoints || 0,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        console.error('Signup DB Error:', error);
        res.status(400).json({ message: error.message || 'Invalid user data' });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            rewardPoints: user.rewardPoints || 0
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = { authUser, registerUser, getUserProfile };
