const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const checkProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const product = await Product.findOne({ name: 'Restaurant Style Dal Makhani' });

        if (product) {
            console.log('FOUND: Product exists in database.');
            console.log('ID:', product._id);
            console.log('Name:', product.name);
            console.log('Price:', product.price);
        } else {
            console.log('NOT FOUND: Product does not exist in database.');
        }

        const allProducts = await Product.find({ name: /Dal/i });
        console.log('All Dal Products:', allProducts.map(p => p.name));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProduct();
