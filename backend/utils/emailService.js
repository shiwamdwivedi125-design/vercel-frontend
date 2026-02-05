const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        logger: true,
        debug: true
    });
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Darti Ka Swad" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP - Darti Ka Swad',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #2d5016; margin-bottom: 20px;">🌿 Darti Ka Swad</h2>
                        <h3 style="color: #333; margin-bottom: 15px;">Password Reset Request</h3>
                        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                            You have requested to reset your password. Please use the following OTP to proceed:
                        </p>
                        <div style="background-color: #f0f7ed; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
                            <h1 style="color: #2d5016; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                        </div>
                        <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                            This OTP is valid for <strong>10 minutes</strong>.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            If you did not request this, please ignore this email or contact support.
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        console.log('-----------------------------------------');
        console.log(`FALLBACK OTP FOR TESTING: ${otp}`);
        console.log('-----------------------------------------');
        throw new Error('Failed to send OTP email');
    }
};

module.exports = { sendOTPEmail };
