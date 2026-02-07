const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // Ensure filename matches case
const { protect, admin } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for contact submissions (prevent spam)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 messages per hour
    message: 'Too many contact inquiries, please try again after an hour.'
});

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
router.post('/', contactLimiter, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const contact = new Contact({
            name,
            email,
            phone,
            message
        });

        const createdContact = await contact.save();

        // --- Email Notification Logic (Nodemailer) ---
        const nodemailer = require('nodemailer');

        // Create a transporter (Standard Gmail SMTP or similar)
        // NOTE: For this to work with Gmail, you need an "App Password"
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shiwamdwivedi125@gmail.com', // Sender Email (Using user's email as sender for now)
                pass: 'YOUR_GMAIL_APP_PASSWORD_HERE' // User needs to replace this
            }
        });

        const mailOptions = {
            from: 'shiwamdwivedi125@gmail.com',
            to: 'shiwamdwivedi125@gmail.com', // Send TO the Admin (User)
            subject: `New Product Inquiry from ${name} - Darti Ka Swad`,
            text: `
Hello Admin,

You have received a new message from the 'Contact Us' page.

--- User Details ---
Name: ${name}
Email: ${email}
Phone: ${phone}

--- Message ---
${message}

Please contact the user back soon.
            `
        };

        // Attempt to send email (Non-blocking)
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Email Error:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        // ---------------------------------------------

        res.status(201).json(createdContact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
