const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login/signup attempts per 15 mins
    message: 'Too many login or signup attempts, please try again after 15 minutes'
});

router.post('/signup',
    authLimiter,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('phone', 'Please enter a valid 10-digit phone number').optional().isLength({ min: 10, max: 10 }).isNumeric(),
    ],
    registerUser
);
router.post('/login',
    authLimiter,
    [
        check('email', 'Valid email is required if using email').optional().isEmail(),
        check('phone', 'Valid phone is required if using phone').optional().isLength({ min: 10, max: 10 }).isNumeric(),
        check('password', 'Password is required').exists(),
    ],
    authUser
);
router.get('/profile', protect, getUserProfile);

module.exports = router;