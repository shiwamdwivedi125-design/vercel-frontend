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

const seedPremiumProduct = async () => {
    await connectDB();

    try {
        // 1. Clean up old attempts
        await Product.deleteMany({ name: 'Special Masala Dosa' });
        await Product.deleteMany({ name: 'Premium Paneer Butter Masala' });
        console.log('Removed old entries.');

        // 2. Get Farmer
        let farmer = await Farmer.findOne();
        if (!farmer) {
            farmer = await Farmer.create({
                name: 'Darti Kitchen',
                village: 'Cloud Kitchen',
                farmingMethod: 'Hygienic',
                bio: 'Authentic North Indian Cuisine',
                image: 'https://cdn-icons-png.flaticon.com/512/3461/3461980.png'
            });
        }

        // 3. Add New Premium Product
        const product = {
            name: 'Premium Paneer Butter Masala',
            description: 'Rich and creamy cottage cheese curry cooked in a tomato-cashew gravy with aromatic spices. Served with 2 Butter Naans and Jeera Rice. A royal treat!',
            price: 249,
            category: 'Dinner',
            farmer: farmer._id,
            // Local Image Path
            image: '/images/pbm_final.jpg',
            stock: 80,
            unit: 'combo',
            source: 'Cloud Kitchen',
            rating: 5,
            reviews: [],
            ingredients: ['Fresh Paneer', 'Tomatoes', 'Cashews', 'Butter', 'Cream', 'Spices'],
            nutrition: {
                calories: 650,
                protein: 18,
                fats: 35,
                carbs: 70
            },
            customization: {
                spiceLevel: true,
                jainOption: true,
                addOns: [
                    { name: 'Extra Butter Naan', price: 40 },
                    { name: 'Gulab Jamun (2 pcs)', price: 50 },
                    { name: 'Masala Chaas', price: 30 }
                ]
            },
            availabilityTime: 'Dinner',
            isSeasonal: false,
            rewardPoints: 25
        };

        const createdProduct = await Product.create(product);
        console.log('PREMIUM Product Added Successfully:', createdProduct.name);

    } catch (error) {
        console.error('Error adding Product:', error);
    } finally {
        mongoose.connection.close();
        process.exit();
    }
};

seedPremiumProduct();
