const asyncHandler = require('express-async-handler');
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');

// @desc    Get all delivery partners
// @route   GET /api/partners
// @access  Private/Admin
const getPartners = asyncHandler(async (req, res) => {
    const partners = await DeliveryPartner.find({});
    res.json(partners);
});

// @desc    Add a new delivery partner
// @route   POST /api/partners
// @access  Private/Admin
const addPartner = asyncHandler(async (req, res) => {
    const { name, phone, vehicle } = req.body;

    const partner = await DeliveryPartner.create({
        name,
        phone,
        vehicle
    });

    if (partner) {
        res.status(201).json(partner);
    } else {
        res.status(400);
        throw new Error('Invalid partner data');
    }
});

// @desc    Assign a partner to an order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
const assignPartnerToOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const { partnerId } = req.body;

    if (order) {
        order.deliveryPartner = partnerId;
        const partner = await DeliveryPartner.findById(partnerId);

        if (partner) {
            partner.status = 'Busy';
            await partner.save();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = {
    getPartners,
    addPartner,
    assignPartnerToOrder
};
