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

        // 1. Check if user exists (Real verification)
        const user = await User.findOne(query);
        if (!user) {
            return res.status(404).json({ message: `No account found with this ${email ? 'email' : 'phone number'}` });
        }

        // 2. Check rate limiting
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const rateLimitQuery = email ? { email: identifier } : { phone: identifier };
        const recentOTPs = await OTP.countDocuments({
            ...rateLimitQuery,
            createdAt: { $gte: oneHourAgo }
        });

        if (recentOTPs >= 10) {
            return res.status(429).json({
                message: 'Too many OTP requests. Please try again after 1 hour.'
            });
        }

        // 3. Generate and save OTP
        const otp = generateOTP();
        await OTP.create({
            email: email ? identifier : undefined,
            phone: phone ? identifier : undefined,
            otp: otp
        });

        // 4. Send OTP via appropriate channel
        if (email) {
            await sendOTPEmail(email, otp);
        } else if (phone) {
            await sendSMSOTP(phone, otp);
        }

        res.status(200).json({
            message: `OTP sent successfully ${email ? 'to email' : 'via SMS'}`,
            identifier
            // OTP is NOT returned in response for real security
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please check your email/settings and try again.' });
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

        // Find valid OTP in Database
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

        try {
            // Verify OTP again
            const otpRecord = await OTP.findOne(query).sort({ createdAt: -1 });

            if (otpRecord) {
                // Find user and update password
                const userQuery = email ? { email: identifier } : { phone: identifier };
                const user = await User.findOne(userQuery);
                if (user) {
                    user.password = newPassword;
                    await user.save();
                    // Delete all OTPs for this identifier
                    await OTP.deleteMany(email ? { email: identifier } : { phone: identifier });
                }

                return res.status(200).json({
                    message: 'Password reset successfully. You can now login with your new password.'
                });
            }

            res.status(400).json({ message: 'Invalid or expired OTP' });
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
