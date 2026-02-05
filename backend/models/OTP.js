const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Auto-delete after 10 minutes
    }
});

// Index for faster queries
otpSchema.index({ email: 1, createdAt: 1 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
