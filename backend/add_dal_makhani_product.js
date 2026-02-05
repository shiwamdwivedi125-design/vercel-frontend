const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const addProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find a farmer to associate (Hebbars Kitchen mock or existing one)
        // We'll use the 'Gopal Krishna Dairy' (Index 2 in seeder) as it fits "Rich/Creamy" theme or just the first one.
        // Let's find one.
        const farmer = await Farmer.findOne({ name: 'Gopal Krishna Dairy' });

        if (!farmer) {
            console.log('Farmer not found, using default');
        }

        const newProduct = {
            name: 'Restaurant Style Dal Makhani',
            price: 220,
            image: '/images/dal_makhani_village.jpg', // Reusing the good image
            farmer: farmer ? farmer._id : null,
            description: 'Slow-cooked black lentils prepared with rich butter and cream. The true essence of North Indian cuisine.',
            category: 'Food Items',
            stock: 50,
            source: 'Cloud Kitchen',
            ingredients: ['Black Lentils', 'Butter', 'Fresh Cream', 'Whole Spices', 'Kidney Beans'],
            nutrition: { calories: 450, protein: 14, fats: 25, carbs: 35 },
            customization: {
                addOns: [
                    { name: 'Extra Butter', price: 30 },
                    { name: 'Garlic Naan', price: 40 },
                    { name: 'Jeera Rice', price: 60 }
                ]
            },
            recipeUrl: 'https://www.youtube.com/embed/Z_d1t_76aYQ',
            isSeasonal: false,
            rewardPoints: 20
        };

        const createdProduct = await Product.create(newProduct);
        console.log(`Product Added Successfully: ${createdProduct.name}`);

        process.exit();
    } catch (error) {
        console.error('Error adding product:', error);
        process.exit(1);
    }
};

addProduct();
