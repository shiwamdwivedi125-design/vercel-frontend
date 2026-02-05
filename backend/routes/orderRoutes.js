const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    cancelOrder,
    returnOrder,
    getOrderStats,
    getOrders // Added missing import
} = require('../controllers/orderController');
const {
    getPartners,
    addPartner,
    assignPartnerToOrder
} = require('../controllers/deliveryPartnerController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/partners').get(protect, admin, getPartners).post(protect, admin, addPartner);
router.route('/:id/assign').put(protect, admin, assignPartnerToOrder);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/return').put(protect, returnOrder);

module.exports = router;
