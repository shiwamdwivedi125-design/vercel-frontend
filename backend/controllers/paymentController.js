const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { amount, currency, receipt } = req.body;

    const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit
        currency: currency || 'INR',
        receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
});

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        // 1. Save Payment details to Payment Collection
        const payment = new Payment({
            orderId: orderId, // Link to our local Order ID
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount: 0, // Ideally pass this or fetch from razorpay order
            currency: 'INR',
            status: 'success'
        });
        await payment.save();

        // 2. Update Order status in Order Collection
        if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: razorpay_payment_id,
                    status: 'success',
                    update_time: Date.now(),
                    email_address: '', // Can be captured from frontend if needed
                };
                await order.save();
            }
        }

        res.json({ status: 'success', paymentId: razorpay_payment_id });
    } else {
        res.status(400);
        throw new Error('Invalid signature');
    }
});



// @desc    Get Razorpay Key ID
// @route   GET /api/payment/key
// @access  Private
const getRazorpayKey = asyncHandler(async (req, res) => {
    res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});

module.exports = { createOrder, verifyPayment, getRazorpayKey };
