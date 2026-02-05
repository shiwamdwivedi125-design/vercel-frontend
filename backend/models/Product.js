const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    unit: {
        type: String, // e.g., 'kg', 'pack'
        default: 'kg'
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
        },
    }],
    rating: {
        type: Number,
        default: 0,
    },
    // New Feature Fields
    source: {
        type: String,
        enum: ['Farm Fresh', 'Home Made', 'Cloud Kitchen'],
        default: 'Farm Fresh'
    },
    ingredients: [{ type: String }],
    nutrition: {
        calories: Number,
        protein: Number,
        fats: Number,
        carbs: Number
    },
    customization: {
        spiceLevel: { type: Boolean, default: false },
        jainOption: { type: Boolean, default: false },
        addOns: [{
            name: String,
            price: Number
        }]
    },
    availabilityTime: {
        type: String,
        enum: ['All Day', 'Breakfast', 'Lunch', 'Dinner'],
        default: 'All Day'
    },
    isSeasonal: { type: Boolean, default: false },
    isCombo: { type: Boolean, default: false },
    rewardPoints: { type: Number, default: 0 },
    recipeUrl: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
