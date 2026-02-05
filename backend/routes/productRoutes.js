const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // Import auth middleware
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    createProductReview
} = require('../controllers/productController');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
