
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');

dotenv.config();

const seedDosa = async () => {
    try {
        await connectDB();
        
        await Product.deleteMany({ name: 'Special Masala Dosa' });
        let farmer = await Farmer.findOne();

        const dosa = {
            name: 'Special Masala Dosa',
            description: 'Crispy rice crepe stuffed with spiced potato filling.',
            price: 149,
            category: 'Breakfast',
            farmer: farmer ? farmer._id : null,
            image: '/images/masala_dosa_final.jpg',
            stock: 50,
            unit: 'plate',
            source: 'Farm Fresh',
            availabilityTime: 'All Day'
        };

        await Product.create(dosa);
        console.log('Product Added!');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seedDosa();