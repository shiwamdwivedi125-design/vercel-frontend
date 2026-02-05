const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        scheduledFor
    } = req.body;

    console.log("SERVER: Received Order Request");
    console.log("User:", req.user?._id);
    console.log("Items:", orderItems?.length);
    console.log("Total:", totalPrice);
    console.log("Payload:", JSON.stringify(req.body, null, 2));


    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            scheduledFor
        });

        const createdOrder = await order.save();

        // Add reward points to user
        const user = await User.findById(req.user._id);
        if (user) {
            const pointsEarned = Math.ceil(totalPrice / 10);
            user.rewardPoints = (user.rewardPoints || 0) + pointsEarned;
            await user.save();
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.isDelivered) {
            res.status(400);
            throw new Error('Cannot cancel a delivered order');
        }

        order.isCancelled = true;
        order.cancelledAt = Date.now();
        order.cancellationReason = req.body.reason || 'No reason provided';

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Return order
// @route   PUT /api/orders/:id/return
// @access  Private
const returnOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (!order.isDelivered) {
            res.status(400);
            throw new Error('Cannot return an order that is not delivered');
        }

        order.isReturned = true;
        order.returnedAt = Date.now();
        order.returnReason = req.body.reason;
        order.returnImage = req.body.image;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name email')
        .populate('deliveryPartner', 'name phone vehicle')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get order stats for admin dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    const usersCount = await User.countDocuments({});
    const ordersCount = orders.length;

    const totalRevenue = orders
        .filter(order => order.isPaid)
        .reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({
        products: await require('../models/Product').countDocuments({}),
        orders: ordersCount,
        users: usersCount,
        revenue: totalRevenue
    });
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    cancelOrder,
    returnOrder,
    getOrderStats,
    getOrders,
};
