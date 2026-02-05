const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).populate('farmer', 'name village');
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('farmer');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Public (for now)
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, stock } = req.body;

    // Temporary: Assign to the first farmer found
    // Temporary: Assign to the first farmer found or create a default one
    let farmer = await Farmer.findOne();
    if (!farmer) {
        farmer = await Farmer.create({
            name: 'Darti Ka Swad Team',
            village: 'Admin',
            farmingMethod: 'Organic',
            bio: 'Official Admin Account',
            image: ''
        });
    }

    const product = new Product({
        name,
        price,
        description,
        image,
        category,
        stock,
        farmer: farmer._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public (for now)
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.stock = stock || product.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});



// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, createProductReview };
