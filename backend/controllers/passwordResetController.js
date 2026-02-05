const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');
const { sendSMSOTP } = require('../utils/smsService');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email or phone
// @route   POST /api/password-reset/send-otp
// @access  Public
const sendOTP = async (req, res) => {
    try {
        const { email, phone } = req.body;

        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or Phone is required' });
        }

        const identifier = email ? email.toLowerCase().trim() : phone.trim();
        const query = email ? { email: identifier } : { phone: identifier };

        // Check if user exists
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ message: `No account found with this ${email ? 'email' : 'phone number'}` });
        }

        // Check rate limiting (increased limit for testing)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const rateLimitQuery = email ? { email: identifier } : { phone: identifier };
        const recentOTPs = await OTP.countDocuments({
            ...rateLimitQuery,
            createdAt: { $gte: oneHourAgo }
        });

        if (recentOTPs >= 20) {
            return res.status(429).json({
                message: 'Too many OTP requests. Please try again after 1 hour.'
            });
        }

        // Generate and save OTP
        const otp = generateOTP();
        await OTP.create({
            email: email ? identifier : undefined,
            phone: phone ? identifier : undefined,
            otp: otp
        });

        // Send OTP via appropriate channel
        if (email) {
            await sendOTPEmail(email, otp);
        } else if (phone) {
            await sendSMSOTP(phone, otp);
        }

        res.status(200).json({
            message: `OTP generated and sent successfully ${email ? 'to email' : 'via SMS'}`,
            identifier,
            otp: otp // Returning OTP for "Auto-fill/Smart Reset" functionality
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

// @desc    Verify OTP
// @route   POST /api/password-reset/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { email, phone, otp } = req.body;

        if ((!email && !phone) || !otp) {
            return res.status(400).json({ message: 'Email/Phone and OTP are required' });
        }

        const identifier = email ? email.toLowerCase().trim() : phone.trim();
        const query = email ? { email: identifier, otp } : { phone: identifier, otp };

        // Find valid OTP
        const otpRecord = await OTP.findOne(query).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid
        res.status(200).json({
            message: 'OTP verified successfully',
            verified: true
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// @desc    Reset password
// @route   POST /api/password-reset/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, phone, otp, newPassword } = req.body;

        if ((!email && !phone) || !otp || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const identifier = email ? email.toLowerCase().trim() : phone.trim();
        const query = email ? { email: identifier, otp } : { phone: identifier, otp };

        // Verify OTP again
        const otpRecord = await OTP.findOne(query).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Find user and update password
        const userQuery = email ? { email: identifier } : { phone: identifier };
        const user = await User.findOne(userQuery);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        // Delete all OTPs for this identifier
        await OTP.deleteMany(email ? { email: identifier } : { phone: identifier });

        res.status(200).json({
            message: 'Password reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    resetPassword
};
