const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const updateVideos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const updates = [
            {
                name: 'Street Style Veg Momos', // Attempting to match by name, distinct from 'Steamed Momos' if renamed
                searchName: 'Momos',
                video: 'https://www.youtube.com/embed/5B09gJSIZss'
            },
            {
                name: 'Royal Paneer Butter Masala',
                searchName: 'Paneer',
                video: 'https://www.youtube.com/embed/0J1d_JmYwH8'
            },
            {
                name: 'Crispy Veg Spring Rolls',
                searchName: 'Spring Rolls',
                video: 'https://www.youtube.com/embed/vwSx_h6Pkdo'
            },
            {
                name: 'Restaurant Style Dal Makhani',
                searchName: 'Dal Makhani',
                video: 'https://www.youtube.com/embed/Z_d1t_76aYQ'
            }
        ];

        for (const update of updates) {
            // Find product by loose matching name
            const product = await Product.findOne({ name: { $regex: update.searchName, $options: 'i' } });

            if (product) {
                product.recipeUrl = update.video;
                // Update name if needed to match the premium one, but user didn't ask for that. 
                // Let's just update recipeUrl.
                await product.save();
                console.log(`Updated video for ${product.name}`);
            } else {
                console.log(`Product not found for ${update.searchName}`);
            }
        }

        console.log('All videos updated');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateVideos();
