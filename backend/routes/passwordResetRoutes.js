const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, resetPassword } = require('../controllers/passwordResetController');

// Send OTP to email
router.post('/send-otp', sendOTP);

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Reset password
router.post('/reset-password', resetPassword);

module.exports = router;
