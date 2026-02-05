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

const seedMomos = async () => {
    await connectDB();

    try {
        // 1. Clean up any existing Momos
        await Product.deleteMany({ name: /Momos/i });
        console.log('Removed old Momo entries.');

        // 2. Get Farmer
        let farmer = await Farmer.findOne();
        if (!farmer) {
            console.log('No farmer found. Creating default...');
            farmer = await Farmer.create({
                name: 'Darti Kitchen',
                village: 'Cloud Kitchen',
                farmingMethod: 'Standard',
                bio: 'Freshly prepared delicacies',
                image: '/images/default_farmer.jpg'
            });
        }

        // 3. Add Steamed Momos
        const momos = {
            name: 'Steamed Momos (8pcs)',
            description: 'Juicy and tender steamed dumplings stuffed with finely chopped vegetables and mild spices. Served with spicy red chutney and creamy mayo.',
            price: 120,
            category: 'Snacks',
            farmer: farmer._id,
            image: '/images/momos_real.jpg',
            stock: 100,
            unit: 'plate',
            source: 'Cloud Kitchen',
            rating: 4.9,
            reviews: [],
            ingredients: ['Refined Flour', 'Cabbage', 'Carrots', 'Spring Onions', 'Garlic', 'Ginger', 'Soya Sauce'],
            nutrition: {
                calories: 280,
                protein: 6,
                fats: 5,
                carbs: 45
            },
            customization: {
                spiceLevel: true,
                jainOption: false,
                addOns: [
                    { name: 'Extra Chutney', price: 10 },
                    { name: 'Mayo Dip', price: 15 },
                    { name: 'Fried Variant', price: 20 }
                ]
            },
            availabilityTime: 'All Day',
            isSeasonal: false,
            rewardPoints: 10
        };

        const createdProduct = await Product.create(momos);
        console.log('Steamed Momos Added Successfully:', createdProduct.name);

    } catch (error) {
        console.error('Error adding Momos:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedMomos();
