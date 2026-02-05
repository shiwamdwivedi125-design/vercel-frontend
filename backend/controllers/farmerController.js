const Farmer = require('../models/Farmer');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all farmers
// @route   GET /api/farmers
// @access  Public
const getFarmers = asyncHandler(async (req, res) => {
    const farmers = await Farmer.find({});
    res.json(farmers);
});

module.exports = { getFarmers };
