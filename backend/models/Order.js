const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner'
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        customization: {
            spice: String,
            noOnionGarlic: Boolean,
            addedItems: [{ name: String, qty: Number }]
        }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    scheduledFor: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    isCancelled: {
        type: Boolean,
        default: false,
    },
    cancelledAt: {
        type: Date,
    },
    cancellationReason: {
        type: String,
    },
    isReturned: {
        type: Boolean,
        default: false,
    },
    returnedAt: {
        type: Date,
    },
    returnReason: {
        type: String,
    },
    returnImage: {
        type: String, // URL of the uploaded image
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
