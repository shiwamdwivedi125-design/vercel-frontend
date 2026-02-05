/**
 * SMS Service for Darti Ka Swad
 * Note: Currently using a mock implementation that logs to console.
 * In production, you can integrate services like Twilio, Fast2SMS, etc.
 */

const sendSMSOTP = async (phone, otp) => {
    try {
        console.log('-----------------------------------------');
        console.log(`📱 SENDING SMS TO: ${phone}`);
        console.log(`💬 MESSAGE: Your Darti Ka Swad verification code is: ${otp}`);
        console.log('-----------------------------------------');

        // You can add real API integration here later
        // Example with fetch:
        // await fetch(`https://sms-gateway.com/send?to=${phone}&msg=Your code is ${otp}`);

        return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
        console.error('SMS sending error:', error);
        return { success: false, message: 'Failed to send SMS' };
    }
};

module.exports = { sendSMSOTP };
