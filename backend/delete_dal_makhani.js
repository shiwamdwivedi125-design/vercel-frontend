const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const deleteProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Delete the specific "Restaurant Style" product
        const result = await Product.deleteOne({ name: 'Restaurant Style Dal Makhani' });

        if (result.deletedCount > 0) {
            console.log('SUCCESS: Product "Restaurant Style Dal Makhani" deleted.');
        } else {
            console.log('NOT FOUND: Product not found or already deleted.');
        }

        // Verify remaining
        const allProducts = await Product.find({ name: /Dal/i });
        console.log('Remaining Dal Products:', allProducts.map(p => p.name));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

deleteProduct();
