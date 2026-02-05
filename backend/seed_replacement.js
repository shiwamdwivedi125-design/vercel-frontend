const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const replaceWithRoyalProduct = async () => {
    await connectDB();

    try {
        // 1. DELETE problematic products to clean slate
        await Product.deleteMany({ name: 'Special Masala Dosa' });
        console.log('Removed Masala Dosa.');

        // 2. Get Farmer
        let farmer = await Farmer.findOne();

        // 3. Add "Royal Paneer Delight" using the CONFIRMED WORKING local image
        const royalProduct = {
            name: 'Royal Paneer Delight',
            description: 'A premium North Indian feast. Rich and creamy Paneer Butter Masala served with 2 Butter Naans, Jeera Rice, and a Gulab Jamun. Authentically cooked in clay pot.',
            price: 299,
            category: 'Dinner',
            farmer: farmer._id,
            // USING THE LOCALLY DOWNLOADED FILE THAT WE KNOW WORKS
            image: '/images/pbm_final.jpg',
            stock: 100,
            unit: 'thali',
            source: 'Cloud Kitchen',
            rating: 5,
            reviews: [],
            ingredients: ['Cottage Cheese', 'Cashew Gravy', 'Butter', 'Cream', 'Basmati Rice'],
            nutrition: {
                calories: 850,
                protein: 25,
                fats: 40,
                carbs: 90
            },
            customization: {
                spiceLevel: true, // User can choose Spicy
                jainOption: true,
                addOns: [
                    { name: 'Extra Naan', price: 40 },
                    { name: 'Lassi', price: 60 },
                    { name: 'Papad', price: 20 }
                ]
            },
            availabilityTime: 'All Day',
            isSeasonal: false,
            rewardPoints: 30
        };

        const createdProduct = await Product.create(royalProduct);
        console.log('REPLACEMENT SUCCESSFUL:', createdProduct.name);

    } catch (error) {
        console.error('Error adding product:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

replaceWithRoyalProduct();
